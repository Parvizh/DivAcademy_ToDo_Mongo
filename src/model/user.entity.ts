import { BeforeInsert, Column, Entity } from "typeorm";
import * as bcrypt from "bcryptjs"
import { config } from "../config";
import { BaseEntity } from "./base-entity";

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column({ type: 'varchar', name: 'name', nullable: false })
    name: string

    @Column({ type: 'varchar', name: 'surname', nullable: false })
    surname: string

    @Column({ type: 'varchar', name: 'password', nullable: false, select: false })
    password: string

    @Column({ type: 'integer', name: 'age' })
    age: number

    @BeforeInsert()
    passwordBcrypt() {
        if (this.password) {
            this.password = bcrypt.hashSync(this.password, Number(config.password_salt))
        }
    }

    get fullName() {
        if (this.name && this.surname) return `${this.name} ${this.surname}`
    }

    toJSON() {
        return {
            ...this,
            fullname: this.fullName
        }
    }
}