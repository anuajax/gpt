// src/entity/User.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number; //The ! tells TypeScript that these fields will be assigned even though it doesn't see them assigned in a constructor, which is typically the case in ORM scenarios.

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    constructor(name: string, email: string, password: string) {
        this.name = name;
        this.email = email;
        this.password = password;
        // ID will be assigned by the database
    }
}
