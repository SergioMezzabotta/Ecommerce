module.exports = {
    resolve: {
        extensions: [".js", ".jsx"],
        fallback: {
            "util": require.resolve("util/")
        },
    },
};