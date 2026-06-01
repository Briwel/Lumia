
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password?: string;

  @Column()
  role: 'agent' | 'client';

  @Column({ nullable: true })
  agencyName?: string;

  @OneToMany(() => Property, (property) => property.agent)
  properties: Property[];
}

@Entity()
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('decimal')
  price: number;

  @Column()
  location: string;

  @Column()
  country: string;

  @Column()
  bedrooms: number;

  @Column()
  bathrooms: number;

  @Column()
  sqft: number;

  @Column()
  type: 'sale' | 'rent';

  @Column({ default: 'available' })
  status: 'available' | 'offer' | 'sold';

  @Column()
  imageUrl: string;

  @Column('text')
  description: string;

  @ManyToOne(() => User, (user) => user.properties)
  agent: User;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity()
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: 'sale_agreement' | 'lease_agreement';

  @ManyToOne(() => Property)
  property: Property;

  @ManyToOne(() => User)
  agent: User;

  @ManyToOne(() => User)
  client: User;

  @Column('text', { nullable: true })
  terms: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'signed' | 'completed';

  @CreateDateColumn()
  createdAt: Date;
}

@Entity()
export class Operation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  transactionType: 'sale' | 'rent';

  @Column('decimal')
  amount: number;

  @ManyToOne(() => Property)
  property: Property;

  @ManyToOne(() => User)
  agent: User;

  @ManyToOne(() => User)
  client: User;

  @CreateDateColumn()
  date: Date;
}
