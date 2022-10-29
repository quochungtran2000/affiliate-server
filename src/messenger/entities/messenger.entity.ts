import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'messenger' })
export class MESSENGER {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  key: string;

  @Column({ nullable: false, default: true })
  active: boolean;

  @Column()
  data: any;
}
