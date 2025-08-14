import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    /*
        - Define o campo como sendo um VARCHAR.
        - Essa definição é opcional pois o ORM identifica pelo tipo da propriedade no TypeScript.
    */
    @Column({ type: "varchar", length: 100, nullable: false })
    title: string;


    /*
        - Indica para o ORM que existe uma relação de Muitos para 1 (N:1) com a Entidade Users.
        - Essa Relação foi indicada da outra entidade também, e o ORM irá criar a Chave Estrangeira (FK) automaticamente.
        - Sempre que ouver relacões entre entidades precisamos declarar a "ida e a volta".
        - Ou seja, se a relação entre Users e Posts for de 1:N a relação entre Posts e Users será de N:1.
        - Essa referência cruzada é obrigatória para que o ORM crie corretamente as Chaves Estrangeiras (FK)
    */
    @ManyToOne(() => User, user => user.posts)
    user: User;

    constructor(title: string, user: User[]){
        this.title = title;
        this.user = user;
    }
}