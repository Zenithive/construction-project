import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
//import { Observable } from 'rxjs';
import  * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtGuard implements CanActivate {


  async canActivate(context: ExecutionContext): Promise<boolean>{
    const ctx = GqlExecutionContext.create(context).getContext();
    const authorizationHeader = ctx.req.header.authorization;
    
    if (authorizationHeader) {        
       const token = authorizationHeader.split(' ')[1];
       try{
        const user = jwt.verify(token, "");
        ctx.user = user;
        return true;
       } catch(error){
        throw new Error("invalid Token");
       }
    }
    else{
        return false;
    }
  }

}
