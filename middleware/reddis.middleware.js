const redisCacheProjects = async (req, res, next) => {
    res.express_redis_cache_name = 'projects-' + req.params.page;
    return next();
};

const redisCacheTopProjects = async (req, res, next) => {
    res.express_redis_cache_name = 'topProjects-' + req.params.page;
    return next();
};

const redisCacheNewestProjects = async (req, res, next) => {
    res.express_redis_cache_name = 'NewestProjects-' + req.params.page;
    return next();
};

module.exports = {
    redisCacheProjects,
    redisCacheTopProjects,
    redisCacheNewestProjects
};