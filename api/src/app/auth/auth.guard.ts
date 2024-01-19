import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
//import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly userService: UserService){

    }

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const ctx = GqlExecutionContext.create(context).getContext();
    const loginInput = ctx.req.body.variables;
    const user: User| null  = await  this.userService.getUserByEmail(loginInput.email);
    if (!user) {
        throw new Error('User not found');
      }
    const isPasswordValid = await bcrypt.compare(loginInput.password, user.password);

    if(user && isPasswordValid){
        ctx.user = user;
        return true;
    }
    else{
        throw new Error('Password is not valid');
    }

  } 
  }