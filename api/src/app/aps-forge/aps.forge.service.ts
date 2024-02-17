import { Injectable } from '@nestjs/common';
import { AuthClientTwoLegged, BucketsApi, DerivativesApi, ObjectsApi } from 'forge-apis';
import { APS_FORGE_CONFIG } from '../Constants/aps.forge.constant';
import fs from 'fs';
//const APS = require('forge-apis');

@Injectable()
export class ApsForgeService {
  publicAuthClient;
  internalAuthClient;

  constructor() {
    this.publicAuthClient = new AuthClientTwoLegged(
      APS_FORGE_CONFIG.APS_CLIENT_ID,
      APS_FORGE_CONFIG.APS_CLIENT_SECRET,
      ['viewables:read'],
      true
    );
    this.internalAuthClient = new AuthClientTwoLegged(
      APS_FORGE_CONFIG.APS_CLIENT_ID,
      APS_FORGE_CONFIG.APS_CLIENT_SECRET,
      [
        'bucket:read',
        'bucket:create',
        'data:read',
        'data:write',
        'data:create',
      ],
      true
    );
  }

  async getAuthToken() {
    if (!this.publicAuthClient.isAuthorized()) {
      await this.publicAuthClient.authenticate();
    }
    return this.publicAuthClient.getCredentials();
  }

  urnify = (id: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) =>
    Buffer.from(id).toString('base64').replace(/=/g, '');

  listObjects = async () => {
    await this.ensureBucketExists(APS_FORGE_CONFIG.APS_BUCKET);
    let resp = await new ObjectsApi().getObjects(
      APS_FORGE_CONFIG.APS_BUCKET,
      { limit: 64 },
      this.publicAuthClient,
      await this.getInternalToken()
    );
    let objects = resp.body.items;
    while (resp.body.next) {
      const startAt: string =
        new URL(resp.body.next).searchParams.get('startAt') || '';
      resp = await new ObjectsApi().getObjects(
        APS_FORGE_CONFIG.APS_BUCKET,
        { limit: 64, startAt },
        this.publicAuthClient,
        await this.getInternalToken()
      );
      objects = objects.concat(resp.body.items);
    }
    return objects;
  };

  getInternalToken = async () => {
    if (!this.internalAuthClient.isAuthorized()) {
      await this.internalAuthClient.authenticate();
    }
    return this.internalAuthClient.getCredentials();
  };

  ensureBucketExists = async (bucketKey: string) => {
    try {
      await new BucketsApi().getBucketDetails(
        bucketKey,
        this.publicAuthClient,
        await this.getInternalToken()
      );
    } catch (err) {
      if (err) {
        //if (err?.response?.status === 404) {
        await new BucketsApi().createBucket(
          { bucketKey, policyKey: 'temporary' },
          {},
          this.publicAuthClient,
          await this.getInternalToken()
        );
      } else {
        throw err;
      }
    }
  };

  async getModels() {
    const objects = await this.listObjects();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return objects.map((o: { objectKey: unknown; objectId: any }) => ({
      name: o.objectKey,
      objectId: o.objectId,
      urn: this.urnify(o.objectId),
    }));
  }

  uploadObject = async (objectName: string, filePath: string) => {
    await this.ensureBucketExists(APS_FORGE_CONFIG.APS_BUCKET);
    const buffer = await fs.promises.readFile(filePath);
    const results = await new ObjectsApi().uploadResources(
      APS_FORGE_CONFIG.APS_BUCKET,
      [{ objectKey: objectName, data: buffer }],
      { useAcceleration: false, minutesExpiration: 15 },
      this.publicAuthClient,
      await this.getInternalToken()
    );
    if (!results[0]) {
      throw results[0];
    } else {
      return results[0].completed;
    }
  };

  translateObject = async (urn: string, rootFilename: string) => {
    const job = {
        input: { urn },
        output: { formats: [{ type: 'svf', views: ['2d', '3d'] }] }
    };
    if (rootFilename) {
        const newObj = {
          compressedUrn: true,
          rootFilename: rootFilename
        }
        
        job.input = {...job.input, ...newObj}
    }
    const resp = await new DerivativesApi().translate(job, {}, this.publicAuthClient, await this.getInternalToken());
    return resp.body;
};

  async createOrg() {
    return [];
  }
}
