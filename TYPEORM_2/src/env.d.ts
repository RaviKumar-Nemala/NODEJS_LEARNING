export declare global {
    namespace NodeJs
    {
        interface ProcessEnv{
            HOST : 'localhost',
            DATABASE_NAME : 'typeorm_learn',
            DATABASE_PORT : 3306,
            DATABASE_USERNAME : 'root',
            DATABASE_PASSWORD : 'thisandthatddosattacking',
        }
    }
}