export type DBType = 'postgresql' | 'mysql' | 'sqlite';

export interface DatabaseConnectionData {
    name: string;
    dbType: DBType;
    host: string;
    port: number;
    username: string;
    password?: string;
    databaseName: string;
}

export interface DatabaseRepository {
    connectDatabase(connection: DatabaseConnectionData, token: string): Promise<{ success: boolean; message: string }>;
}