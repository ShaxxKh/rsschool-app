import * as Router from 'koa-router';
import { ILogger } from '../logger';
import { authRoute, guard } from './auth';
import {
    courseRoute,
    courseImportRoute,
    courseAssignStudentsRoute,
    courseEnrollRoute,
    courseEventsRoute,
} from './course';
import { coursesRoute } from './courses';
import { eventRoute } from './event';
import { healthRoute } from './health';
import { sessionRoute } from './session';
import { userFeedRoute, userParticipationsRoute, userProfileRoute } from './user';

type RoutesMiddleware = (logger: ILogger) => Router;

function log(logger: ILogger, name: string) {
    return logger.child({ module: `route:${name}` });
}

function applyRoute(router: Router, routeFactory: (logger: ILogger) => Router, logger: ILogger) {
    const route = routeFactory(logger);
    router.use(route.routes());
    router.use(route.allowedMethods());
}

export const routesMiddleware: RoutesMiddleware = logger => {
    const router = new Router();

    router.use(healthRoute(log(logger, 'health')));
    applyRoute(router, authRoute, log(logger, 'auth'));
    applyRoute(router, sessionRoute, log(logger, 'session'));
    // applyRoute(router, courseImportRoute, log(logger, 'course/import'));

    router.use(guard);

    // Requires authentication
    applyRoute(router, courseRoute, log(logger, 'course'));
    applyRoute(router, courseEnrollRoute, log(logger, 'course/enroll'));
    applyRoute(router, courseEventsRoute, log(logger, 'course/events'));
    applyRoute(router, courseAssignStudentsRoute, log(logger, 'course/assign-students'));

    applyRoute(router, coursesRoute, log(logger, 'courses'));

    applyRoute(router, eventRoute, log(logger, 'event'));
    applyRoute(router, userProfileRoute, log(logger, 'user/profile'));
    applyRoute(router, userParticipationsRoute, log(logger, 'user/participations'));
    applyRoute(router, userFeedRoute, log(logger, 'user/feed'));

    return router;
};