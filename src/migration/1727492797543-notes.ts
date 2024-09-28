import { MigrationInterface, QueryRunner } from "typeorm";

export class Notes1727492797543 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE notes (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID,
                complete BOOLEAN DEFAULT false,
                description VARCHAR NOT NULL,
                tags TEXT[],  -- Usando um array de texto
                limit_date TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);

    // Adiciona um trigger para atualizar a coluna updated_at automaticamente
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
            CREATE TRIGGER update_notes_updated_at
            BEFORE UPDATE ON notes
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE notes;`);
  }
}
