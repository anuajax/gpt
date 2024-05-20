// src/entity/User.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AuthMethod } from './AuthMethod';

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id!: number; //The ! tells TypeScript that these fields will be assigned even though it doesn't see them assigned in a constructor, which is typically the case in ORM scenarios.

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    authtype: string;

    @Column({ nullable: true })
    googleId?: string;

    // @OneToMany(() => AuthMethod, authMethod => authMethod.user)
    // authMethods: AuthMethod[]

    constructor(name: string, email: string, password: string, googleId: string, authtype: string) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.googleId = googleId;
        this.authtype = authtype;
        // ID will be assigned by the database
    }
}
