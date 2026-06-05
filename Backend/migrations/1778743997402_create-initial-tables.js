exports.up = (pgm) => {
  // Create users table
  pgm.createTable('users', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password: { type: 'varchar(255)', notNull: true },
    created_at: { type: 'timestamp with time zone', default: pgm.func('CURRENT_TIMESTAMP') }
  }, { ifNotExists: true });

  // Create predictions table
  pgm.createTable('predictions', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', notNull: true, references: 'users', onDelete: 'CASCADE' },
    nama_usaha: { type: 'varchar(255)' },
    usia_pemilik: { type: 'integer' },
    lama_usaha: { type: 'integer' },
    pendapatan_bulanan: { type: 'bigint' },
    pengeluaran_bulanan: { type: 'bigint' },
    jumlah_pinjaman: { type: 'bigint' },
    riwayat_telat_bayar: { type: 'integer', default: 0 },
    jumlah_tanggungan: { type: 'integer', default: 0 },
    score: { type: 'integer' },
    status: { type: 'varchar(50)' },
    created_at: { type: 'timestamp with time zone', default: pgm.func('CURRENT_TIMESTAMP') }
  }, { ifNotExists: true });

  // Create audit_log table
  pgm.createTable('audit_log', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', references: 'users', onDelete: 'SET NULL' },
    action: { type: 'varchar(255)', notNull: true },
    details: { type: 'text' },
    created_at: { type: 'timestamp with time zone', default: pgm.func('CURRENT_TIMESTAMP') }
  }, { ifNotExists: true });

  // Create indexes
  pgm.createIndex('predictions', 'user_id', { ifNotExists: true });
  pgm.createIndex('predictions', 'created_at', { ifNotExists: true });
  pgm.createIndex('audit_log', 'user_id', { ifNotExists: true });
  pgm.createIndex('users', 'email', { ifNotExists: true });
};

exports.down = (pgm) => {
  pgm.dropTable('audit_log', { ifExists: true });
  pgm.dropTable('predictions', { ifExists: true });
  pgm.dropTable('users', { ifExists: true });
};
