import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from './Post';
//import { Post } from './Post';

@Entity('users') // Informa para o ORM que essa classe será uma Entidade do Banco de Dados
export class User {
    @PrimaryGeneratedColumn() // Define que o campo será uma Chave Primária (PK) e Auto Incrementável (AI)
    id!: number;

    @Column({ length: 100, nullable: false }) // Define que o tamanho do campo é de 100 caracteres, e não pode ser nulo.
    name!: string; // VARCHAR(100) NOT NULL

    @Column({ unique: true }) // Define que o campo é Único (UK)
    email!: string; // VARCHAR UNIQUE - UNICO

    /*
        - Indica para o ORM que existe uma relação de 1 para Muitos (1:N) com a Entidade Posts.
        - Essa Relação será indicada da outra entidade também, e o ORM irá criar a Chave Estrangeira (FK) automaticamente.
        - Essa prática é extremamente importante para que possam ser realizadas consultas em múltiplas tabelas posteriormente.
    */
    @OneToMany(() => Post, post => post.user)
    posts?: Post[];

    constructor(name: string, emial: string, posts: Post[] = []) {
        this.name = name;
        this.email = emial;
        this.posts = posts;
    }
}