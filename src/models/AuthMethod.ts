import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import User from "./User.js";

@Entity()
export class AuthMethod {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    type: string; // 'password', 'google', etc.

    @Column({ nullable: true })
    secret: string; // Password hash or OAuth token

    // @ManyToOne(() => User, user => user.authMethods)
    // user: User;

    constructor(type: string, secret: string, user: User) {
        this.type = type;
        this.secret = secret;
        // this.user = user;
        // ID will be assigned by the database
    }
}
