/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    collectCoverage: true,
    testEnvironment: "node",
    coverageReporters: ["text", "html"],
    coverageThreshold: {
        global: {
            statements: 100,
            functions: 100,
            branches: 100,
            lines: 100,
        },
    },
};
