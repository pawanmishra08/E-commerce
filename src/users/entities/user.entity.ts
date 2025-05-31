import { Exclude, Expose } from "class-transformer";
import { Roles } from "../../../src/utility/common/user.roles.enum";
import { Column, Entity, PrimaryGeneratedColumn, Timestamp, CreateDateColumn , UpdateDateColumn} from "typeorm";

@Exclude()
@Entity('users')
export class UserEntity {
    @Expose()
    @PrimaryGeneratedColumn()
    id:number;

    @Expose()
    @Column()
    name: string;


    @Expose()
    @Column({unique: true})
    email: string;

    @Expose()
    @Column({select: false})
    password: string;

    @Expose()
    @Column({type: 'enum', enum: Roles, default: [Roles.USER]})
    roles:Roles[];

    @Expose()
    @CreateDateColumn()
    createdAt: Timestamp;

    @Expose()
    @UpdateDateColumn()
    updatedAt: Timestamp;
}

