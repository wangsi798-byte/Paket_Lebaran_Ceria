module.exports = {
    // Direktori test
    testMatch: [
        '**/tests/**/*.js',
        '**/__tests__/**/*.js'
    ],
    
    // Lingkungan test
    testEnvironment: 'node',
    
    // Coverage
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50
        }
    },
    
    // Module aliases
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    
    // Setup file sebelum test
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    
    // Abaikan direktori
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/'
    ],
    
    // Konfigurasi spesifik
    globals: {
        __DEV__: true
    },
    
    // Timeout
    testTimeout: 30000
};