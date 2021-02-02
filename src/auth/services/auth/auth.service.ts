import { LoginUserDto } from './../../dto/loginUser.dto';
import { CreateUserDto } from '../../dto/createUser.dto';
import { User } from './../../../entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from  '@nestjs/jwt';
import { UserService } from  '../user/user.service';
import * as crypto from 'crypto';
import { Role } from 'src/enums/role.enum';


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,

    ) { }

    private async validate(userData: LoginUserDto): Promise<User> {
        return await this.userService.findByEmail(userData.email);
    }

    private async comparePasswords(sentPassword,dbPassword){
        sentPassword=crypto.createHmac('sha256', sentPassword).digest('hex');
        return sentPassword===dbPassword;

    }

    public async login(user: LoginUserDto): Promise< any | { status: number }>{
        return this.validate(user).then(async (userData)=>{
          if(!userData){
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
          }
      const areEqual = await this.comparePasswords(user.password, userData.password);
    
         if (!areEqual) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);    
         }

          let payload = `${userData.email}${userData.cin}`;
          const accessToken = this.jwtService.sign(payload);
          //started making u bech nraj3ou howa, just gotta find el entity lo5ra suivant el usertype
         let u : any = {
            token: accessToken,
            cin: userData.cin,
            email: userData.email,
            role: userData.role,
         }
        //  switch (userData.role){
        //      case Role.Student : {
        //         //get el studentRepository w find bel CIN mta3 el user
        //          //remarque: fel student kahaw: el primary key composite (cin, anneescolaire) donc a3mel findOne({ where: {cin : userData.cin}})
        //          // mouch find(userData.cin) 5ater it wont work :)
        //          //put fel u el infosyou wanna get back mel o

        //         break;
        //      }
        //     //do other cases, admin w enseignant

        //  }

        //return el u
          return {
             token: accessToken,
             cin: userData.cin,
             email: userData.email,
            //  firstname: userData.firstname,
            //  lastname: userData.lastname,
            //  phoneNumber:userData.phoneNumber,
             role:userData.role

          };

        });
    }



}