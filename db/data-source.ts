import {DataSource, DataSourceOptions} from 'typeorm';
import {config} from 'dotenv';

config();
export const datasourceoptions: DataSourceOptions ={
type: 'postgres',
host: process.env.DB_HOST,
port: Number(process.env.DB_PORT),
username: process.env.DB_USERNAME,
password: process.env.DB_PASSWORD,
database: process.env.DB_DATABASE,
entities: ['disks/**/*.entity{.ts,.js}'],
migrations: [],
logging: false,
synchronize: true,
}

const dataSource = new DataSource(datasourceoptions);
export default dataSource;