import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'user', database: 'blog_affiliate' })
export class USER {
  @ObjectIdColumn({ name: '_id' })
  id: ObjectID;

  @Column({ name: 'name' })
  name: string;
}
