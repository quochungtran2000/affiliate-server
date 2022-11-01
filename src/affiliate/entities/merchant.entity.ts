import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'merchant' })
export class MERCHANT {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  key: string;

  @Column({ nullable: false, default: true })
  active: boolean;

  @Column()
  display_name: string;

  @Column()
  type: 'coupon' | 'coupon_hot';

  @Column()
  merchant_id: string;

  @Column()
  logo: string;

  @Column()
  path: string;

  @Column()
  target: string;
}
