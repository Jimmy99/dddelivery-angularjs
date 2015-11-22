var app = angular.module("app");

app.factory("BackendService", function($cookieStore) {
    var backends = [{
        host: 'http://dddsample.marcusoncode.se',
        description: 'Go (Marcus Olsson)'
    },
        {
            host: 'http://localhost:3000',
            description: 'localhost:3000'
        }];

    return {
        select: function(b) {
            $cookieStore.put('currentBackend', b);
        },
        getCurrent: function() {
            return $cookieStore.get('currentBackend') || backends[0];
        },
        getAll: function() {
            return backends;
        }
    };
});

app.factory("IncidentService", function(Incident) {
    return {
        registerIncident: function(completionTime, trackingId, voyage, location, eventType) {
            return Incident.register({
                completionTime: completionTime,
                trackingId: trackingId,
                voyage: voyage,
                location: location,
                eventType: eventType
            }, function(data) {
                return data;
            });
        }
    };
})

app.factory("BookingService", function(Location, Cargo, AssignToRoute, RouteCandidates, Destination) {
    return {
        getCargos: function() {
            return Cargo.list(function(data) {
                return data
            });
        },
        getCargo: function(trackingId) {
            return Cargo.find({
                id: trackingId
            }, function(data) {
                return data;
            });
        },
        bookCargo: function(origin, destination, arrivalDeadline) {
            return Cargo.book({
                origin: origin,
                destination: destination,
                arrivalDeadline: arrivalDeadline
            }, function(data) {
                return data;
            });
        },
        assignToRoute: function(trackingId, itinerary) {
            return AssignToRoute.assign({
                id: trackingId
            }, itinerary, function(data) {
                return data;
            });
        },
        requestPossibleRoutes: function(trackingId) {
            return RouteCandidates.request({
                id: trackingId
            }, function(data) {
                return data;
            });
        },
        changeDestination: function(trackingId, destination) {
            return Destination.change({
                id: trackingId,
                destination: destination
            }, function(data) {
                return data;
            });
        },
        getLocations: function() {
            return Location.list(function(data) {
                return data.locations;
            });
        }

    };
});

app.factory("Incident", function($resource, BackendService) {
    return $resource(BackendService.getCurrent().host + "/incidents", null, {
        'register': {
            method: 'POST',
            params: {
                completionTime: "@completionTime",
                trackingId: "@trackingId",
                voyage: "@voyage",
                location: "@location",
                eventType: "@eventType"
            }
        }
    });
});

app.factory("Cargo", function($resource, BackendService) {
    return $resource(BackendService.getCurrent().host + "/cargos/:id", null, {
        'find': {
            method: 'GET',
            params: {
                id: "@id"
            }
        },
        'list': {
            method: 'GET'
        },
        'book': {
            method: 'POST',
            params: {
                origin: "@origin",
                destination: "@destination",
                arrivalDeadline: "@arrivalDeadline"
            }
        }
    });
});

app.factory("Location", function($resource, BackendService) {
    return $resource(BackendService.getCurrent().host + "/locations", null, {
        'list': {
            method: 'GET'
        }
    });
});

app.factory("Destination", function($resource, BackendService) {
    return $resource(BackendService.getCurrent().host + "/cargos/:id/change_destination", null, {
        'change': {
            method: 'POST',
            params: {
                id: "@id",
                destination: "@destination"
            }
        }
    });
});

app.factory("AssignToRoute", function($resource, BackendService) {
    return $resource(BackendService.getCurrent().host + "/cargos/:id/assign_to_route", null, {
        'assign': {
            method: 'POST',
            params: {
                id: "@id"
            }
        }
    });
});

app.factory("RouteCandidates", function($resource, BackendService) {
    return $resource(BackendService.getCurrent().host + "/cargos/:id/request_routes", null, {
        'request': {
            method: 'GET',
            params: {
                id: "@id"
            }
        }
    });
});
