/**
 * Directive: Inbox <inbox></inbox>
 */
angular.module('AuroraApp')
    .directive('inbox', ['InboxFactory', function InboxDrctv(InboxFactory) {
        'use strict';

        return {
            restrict: 'EA',
            replace: true,
            scope: {
                flightId: '='
            },
            templateUrl: "app/directives/inbox.tmpl.html",
            controllerAs: 'viewInbox',

            controller: function($scope) {
                this.inboxMessages = {};

                if ($scope.flightId != undefined) {
                    InboxFactory.getFlightMessages($scope.flightId)
                        .then(angular.bind(this, function then() {
                            this.inboxMessages = InboxFactory.messages;
                        }));
                } else {
                    InboxFactory.getMessages()
                        .then(angular.bind(this, function then() {
                            this.inboxMessages = InboxFactory.messages;
                        }));

                }

                console.warn('this.inboxMessages InboxDirective: ', this);

                this.goToMessage = function(id) {
                    InboxFactory.goToMessage(id);
                };

                this.deleteMessage = function(id, index) {
                    InboxFactory.deleteMessage(id, index);
                };

            },

            link: function(scope, element, attrs, ctrl) {
                /* 
                  by convention we do not $ prefix arguments to the link function
                  this is to be explicit that they have a fixed order
                */
            }
        }
    }]);



angular.module('AuroraApp')
    .directive('inboxContext', ['InboxFactory', '$location', function(InboxFactory, $location) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, ctrl) {
                angular.element(element).on('click', function() {
                    var flightsHashPattern = /^(\/flights\/)(\d+\/)(\d+\/)(\d+)$/;
                    var inboxForFlightPattern = /^(\/inbox\/)(\d+)$/;
                    var param;
                    //If it's flight inbox
                    if ((flightsHashPattern.test($location.path())) || (inboxForFlightPattern.test($location.path()))) {
                        param = $location.path().split('/');
                        $location.path('/inbox/' + param[param.length - 1]);
                    } else {
                        $location.path('/inbox');
                    }
                    scope.$apply();
                });
            }
        };
    }]);


angular.module('AuroraApp')
    .directive('scroll', [function() {
        return {
            restrict: 'A',
            scope: {
                direction: '@',
                itemWidth: '@',
                totalNoItems: '@',
                noItemsShow: '@',
                containerId: '@'
            },
            link: function(scope, ele, attr) {



                var isRightScrollable = function(itemWidth, noItemsVisible, totalItems, yPos) {
                    itemWidth = parseInt(itemWidth);
                    noItemsVisible = parseInt(noItemsVisible);
                    totalItems = parseInt(totalItems);

                    var flag = false;
                    var offsetWidth;
                    if (totalItems > noItemsVisible) {
                        offsetWidth = (totalItems - noItemsVisible) * itemWidth * -1;
                        if (yPos > offsetWidth) {
                            flag = true;
                        }
                    }
                    return flag;
                };

                angular.element(ele).on('click', function() {
                    var target = angular.element('#' + scope.containerId);
                    var current = parseInt(target.css('left'));

                    if (scope.direction == 'left') {
                        if (current < 0) {
                            current += parseInt(scope.itemWidth);
                            if (current > 0) {
                                current = 0;
                            }
                            target.css('left', current + 'px');
                        }
                    } else {
                        current = current + (parseInt(scope.itemWidth) * -1);
                        if (isRightScrollable(scope.itemWidth, scope.noItemsShow, scope.totalNoItems, current)) {
                            target.css('left', current + 'px');
                        }
                    }
                });

            }
        }
    }]);


/**
 * Directive: Email <email></email>
 */
angular.module('AuroraApp')
    .directive('email', ['$timeout', 'EmailFactory', '$routeParams', function EmailDrctv($timeout, EmailFactory, $routeParams) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: "app/directives/email.tmpl.html",
            controllerAs: 'email',

            controller: function() {
                this.message = {};

                this.reply = function(message) {
                    EmailFactory.reply(message);
                };

                var getmessage = EmailFactory.getMessage($routeParams);

                if (getmessage) {
                    getmessage.then(angular.bind(this, function(response) {
                        EmailFactory.message = response;
                        this.message = EmailFactory.message;
                        this.message.content = this.message.content.replace(/(\r\n|\n|\r)/gm, "<br>");
                        // $scope.$parent.email.title = this.message.subject;
                    }));
                }

                console.warn('Email directive / Page: ', this);
            },

            link: function(scope, element, attrs, ctrl) {
                var textarea = element.find('.email__response-text')[0];
                scope.$watch('reply', function(newVal, oldVal) {
                    if (newVal === oldVal) return;
                    if (newVal) {
                        $timeout(function() {
                            textarea.focus();
                        }, 0);
                    }
                })
            }
        }
    }]);


/**
 * Directive: Roadmap <roadmap></roadmap>
 */
// angular.module('AuroraApp')
//     .directive('roadmap', ['FlightsFactory', function RoadmapDrctv(FlightsFactory) {
//         'use strict';

//         return {
//             restrict: 'EA',
//             replace: true,
//             scope: true,
//             templateUrl: "app/directives/roadmap.tmpl.html",
//             controllerAs: 'roadmap',

//             controller: function() {
//                 this.flights = {};
//                 this.dayHours = 24;
//                 this.setHour = 0;
//                 this.setMinutes = 0;
//                 this.setAllMinutes = 0;
//                 this.leftOffset = 0;

//                 console.warn('this roadmap directive: ', this);

//                 FlightsFactory.getFlights()
//                     .then(angular.bind(this, function then() {
//                         this.flights = FlightsFactory.flights;
//                     }));

//                 this.goToFlight = function(id) {
//                     FlightsFactory.goToFlight(id);
//                 };

//                 this.setFlightToHour = function(timestamp) {
//                     var date = new Date(timestamp * 1000);
//                     var hours = date.getHours();
//                     var minutes = date.getMinutes();
//                     var seconds = date.getSeconds();
//                     var onlyMinutes = hours * 60 + minutes;

//                     this.setHour = hours;
//                     this.setMinutes = minutes;
//                     this.setAllMinutes = onlyMinutes;

//                     this.leftOffset = parseFloat(((100 * this.setAllMinutes) / (this.dayHours * 60))).toFixed(3);

//                     // console.warn( angular.element(document.querySelector('#gotohour' + this.setHour)).offset().left )

//                     // var formattedTime = hours + ':' + minutes.substr(minutes.length - 2) + ':' + seconds.substr(seconds.length - 2);
//                     // console.log('####date: ', date, ' ####hours: ', hours, ' ####minutes: ', minutes, '####setAllMinutes: ', this.setAllMinutes, ' ####seconds: ', seconds, ' #####this.leftOffset: ', this.leftOffset, this);

//                     return {
//                         // left: angular.element(document.querySelector('#gotohour' + (this.setHour === 0 ? 24 : this.setHour))).offset().left + 'px'
//                         left: this.leftOffset + '%'
//                     }
//                 };

//                 this.setFlightToHour2 = function(timestamp) {
//                     var flightDate = new Date(timestamp * 1000);
//                     var flightHours = flightDate.getHours();

//                     var hourOffset = angular.element(document.querySelector('#gotohour' + flightHours)).offset().left;

//                     console.warn(hourOffset)

//                     // return {
//                     //     left: hourOffset + 'px'
//                     // }
//                 };

//             },

//             link: function(scope, element, attrs, ctrl) {
//                 // console.warn(element);
//             }
//         }
//     }]);


/**
 * Directive: Timespan <timespan></timespan>
 */
// angular.module('AuroraApp')
//     .directive('timespan', ['FlightsFactory', function TimespanDrctv(FlightsFactory) {
//         'use strict';

//         return {
//             restrict: 'EA',
//             replace: true,
//             scope: false, // the directive does not create a new scope, so there is no inheritance here. The directive's scope is the same scope as the parent/container. In the link function, use the first parameter (typically scope) . ///// You cannot access the scope in the directive's compile function (as mentioned here: https://github.com/angular/angular.js/wiki/Understanding-Directives). You can access the directive's scope in the link function.
//             templateUrl: "app/directives/timespan.tmpl.html",
//             controllerAs: 'timespan',

//             controller: function() {
//                 this.hours = 24;
//                 this.date = new Date();
//                 this.myWorkingHours = [];
//                 this.dayOfWeek = this.date.getDay();
//                 this.currentHour = this.date.getHours();
//                 this.timespanWidth = parseFloat(100 / this.hours).toFixed(3);
//                 this.flights = {};
//                 this.loginDate = 0;

//                 var allHours = [];
//                 var todayHours = [];
//                 var tomorrowHours = [];

//                 // FlightsFactory.getFlights()
//                 //     .then(angular.bind(this, function then() {
//                 //         this.flights = FlightsFactory.flights;
//                 //         this.loginDate = this.flights.login_date;
//                 //     }));

//                 this.goToFlight = function(id) {
//                     FlightsFactory.goToFlight(id);
//                 };

//                 this.setFlightToMinutes = function(timestamp) {
//                     var flightDate = new Date(timestamp * 1000);
//                     var flightHours = flightDate.getHours();
//                     var flightMinutes = flightDate.getMinutes();
//                     var minutesOffset = parseFloat(flightMinutes * 100 / 60).toFixed(3); // percent of current minutes within 60 minutes, for moving flight item inside hour timespan

//                     return {
//                         left: minutesOffset + '%'
//                     }
//                 };

//                 // build 24hours roadmap starting with current hour
//                 for (var i = 0; i < this.hours; i++) {
//                     allHours.push(i);
//                 };

//                 for (var i = this.currentHour; i < this.hours; i++) {
//                     todayHours.push(i);
//                 };

//                 $.each(allHours, function(key) {
//                     if (-1 === todayHours.indexOf(key)) {
//                         tomorrowHours.push(key);
//                     }
//                 });

//                 this.myWorkingHours = todayHours.concat(tomorrowHours);

//                 // this.move = function(old_index, new_index) {
//                 //     if (new_index >= this.length) {
//                 //         var k = new_index - this.length;
//                 //         while ((k--) + 1) {
//                 //             this.push(undefined);
//                 //         }
//                 //     }
//                 //     this.splice(new_index, 0, this.splice(old_index, 1)[0]);
//                 //     return this; // for testing purposes
//                 // };
//                 console.warn('timespan directive : ', this.flights);
//             },

//             link: function(scope, element, attrs, ctrl) {
//                 if (!angular.isUndefined(scope.$parent.myFlights)) {
//                     ctrl.flights = scope.$parent.myFlights.flights;
//                     console.log('aaa: ', ctrl.flights);
//                 } else if (!angular.isUndefined(scope.$parent.availableFlights)) {
//                     ctrl.flights = scope.$parent.availableFlights.flights;
//                     console.log('bbb: ', ctrl.flights);
//                 } else {
//                     return false;
//                 }
//                 ctrl.loginDate = ctrl.flights.login_date;


//                 // ctrl.flights = !angular.isUndefined(scope.$parent.myFlights) ? scope.$parent.myFlights.flights : scope.$parent.availableFlights.flights;
//                 // ctrl.loginDate = ctrl.flights.login_date;

//                 console.warn('#########: ', ctrl.flights, scope.$parent.myFlights, scope.$parent.availableFlights);

//             }
//         }
//     }]);


/**
 * Directive: Nrmess <nrmess></nrmess>
 */
angular.module('AuroraApp')
    .directive('nrmess', ['InboxFactory', '$location', function NrmessDrctv(InboxFactory, $location) {
        'use strict';

        return {
            restrict: 'EA',
            replace: true,
            scope: true,
            templateUrl: "app/directives/nrmessages.tmpl.html",
            controllerAs: 'nrmessages',

            controller: function() {

                var endPoint = '';
                var parts = $location.path().split('/');


                var flightsHashPattern = /^(\/flights\/)(\d+\/)(\d+\/)(\d+)$/;
                var inboxForFlightPattern = /^(\/inbox\/)(\d+)$/;
                var flightId = null;
                if ((flightsHashPattern.test($location.path())) || (inboxForFlightPattern.test($location.path()))) {
                    flightId = parts[parts.length - 1];
                    InboxFactory.getFlightMessages(flightId)
                        .then(
                            angular.bind(this, function then() {
                                this.unreadMessages = InboxFactory.unreadMessages;
                            }));

                } else {
                    InboxFactory.getMessages()
                        .then(
                            angular.bind(this, function then() {
                                this.unreadMessages = InboxFactory.unreadMessages;
                            }));
                }
            },

            link: function(scope, element, attrs, ctrl) {}
        }
    }]);


/**
 * Directive: Notifications <nrnotif></nrnotif>
 */
angular.module('AuroraApp')
    .directive('nrnotif', ['InboxFactory', function NrnotifDrctv(InboxFactory) {
        'use strict';

        return {
            restrict: 'EA',
            replace: true,
            scope: true,
            templateUrl: "app/directives/nrnotif.tmpl.html",
            controllerAs: 'nrnotif',

            controller: function() {
                this.notifications = {};

                InboxFactory.getNotifications()
                    .then(angular.bind(this, function then() {
                        this.notifications = InboxFactory.notifications;
                    }));

                console.warn('this.nrnotif Nr : ', this);

            },

            link: function(scope, element, attrs, ctrl) {}
        }
    }]);


/**
 * Directive: Notification <notification></notification>
 */
angular.module('AuroraApp')
    .directive('notification', ['InboxFactory', function NotificationDrctv(InboxFactory) {
        'use strict';

        return {
            restrict: 'EA',
            replace: true,
            scope: true,
            templateUrl: "app/directives/notification.tmpl.html",
            controllerAs: 'notificationPage',

            controller: function() {
                this.notification = {};

                InboxFactory.getNotifications()
                    .then(angular.bind(this, function then() {
                        this.notification = InboxFactory.notifications;
                    }));

                console.warn('this.notification page: ', this);

            },

            link: function(scope, element, attrs, ctrl) {}
        }
    }]);


/**
 * Directive: CDL Items <cdl></cdl>
 */
angular.module('AuroraApp')
    .directive('cdl', ['CdlFactory', function CdlDrctv(CdlFactory) {
        'use strict';

        return {
            restrict: 'EA',
            replace: true,
            scope: true,
            templateUrl: "app/directives/cdl.tmpl.html",
            controllerAs: 'cdl',

            controller: function() {
                this.cdlItems = {};

                CdlFactory.getCdlItems()
                    .then(angular.bind(this, function then() {
                        this.cdlItems = CdlFactory.cdlItems;
                    }));

                this.submitReportCdl = function(cdl) {
                    console.log('cdl: ', cdl);

                    if (!angular.isUndefined(cdl.cdlItems) && !angular.isUndefined(cdl.newCdl)) {
                        CdlFactory.submitReportCdl(cdl.cdlItems, cdl.newCdl);
                    }
                };

                console.warn('this.cdlItems page: ', this);

            },

            link: function(scope, element, attrs, ctrl) {}
        }
    }]);


/**
 * Directive: Lower Deck <lower-deck></lower-deck>
 */
/*
 angular.module('AuroraApp')
 .directive('lowerDeck', ['FlightFactory', '$routeParams', function TimespanDrctv(FlightFactory, $routeParams) {
 'use strict';

 return {
 restrict: 'EA',
 replace: true,
 scope: true,
 templateUrl: "app/directives/lowerDeck.tmpl.html",
 controllerAs: 'lowerDeck',

 controller: function() {
 this.lowerdeck = {};
 this.fixedWidth = 1200;

 var flight = FlightFactory.getFlight($routeParams);
 if (flight) {
 flight.then(angular.bind(this, function(response) {
 this.lowerdeck = response.lowerDeckLayout;
 this.scaledWidth = FlightFactory.px2InchRatio(this.fixedWidth, this.lowerdeck.deckLength);
 }));
 }

 this.setStyle = function(centroid, width, height, lateral_adjust, uld_compatibility_group) {
 var axisPoint = parseFloat(centroid * this.scaledWidth).toFixed(3);
 var width = parseFloat(width * this.scaledWidth).toFixed(3);
 var height = parseFloat(height * this.scaledWidth).toFixed(3);
 var lateralAdjust = parseFloat(lateral_adjust).toFixed(2);
 var compatibility = uld_compatibility_group;

 // console.log(axisPoint, width, height, compatibility);

 switch (compatibility) {
 // A - 88x125
 case "A":
 return {
 width: width + 'px',
 height: height + 'px',
 right: parseFloat(axisPoint - width / 2).toFixed(2) + 'px',
 marginTop: parseInt(height / 2, 10) * -1 + 'px'
 }
 break;
 // B - 96x125
 case "B":
 return {
 width: width + 'px',
 height: height + 'px',
 right: parseFloat(axisPoint - width / 2).toFixed(2) + 'px',
 marginTop: parseInt(height / 2, 10) * -1 + 'px'
 }
 break;
 // C - 60.4x61.5
 case "C":
 if (lateralAdjust > 0) {
 return {
 width: width + 'px',
 height: height + 'px',
 right: parseFloat(axisPoint - width / 2).toFixed(2) + 'px',
 top: 50 + '%',
 marginTop: parseInt(height, 10) * -1 + 'px'
 }
 } else if (lateralAdjust < 0) {
 return {
 width: width + 'px',
 height: height + 'px',
 right: parseFloat(axisPoint - width / 2).toFixed(2) + 'px',
 bottom: 50 + '%',
 marginBottom: parseInt(height, 10) * -1 + 'px'
 }
 }
 break;
 // X - 61.5x60.4
 case "X":
 return {
 width: width + 'px',
 height: height + 'px',
 right: parseFloat(axisPoint - width / 2).toFixed(2) + 'px',
 top: 50 + '%',
 marginTop: parseInt(height / 2, 10) * -1 + 'px'
 }
 break;
 // E - 60.4x125
 case "E":
 return {
 width: width + 'px',
 height: height + 'px',
 right: parseFloat(axisPoint - width / 2).toFixed(2) + 'px',
 marginTop: parseInt(height / 2, 10) * -1 + 'px'
 }
 break;
 // F - 60.4x47
 case "F":
 return {
 width: width + 'px',
 height: height + 'px',
 right: parseFloat(axisPoint - width / 2).toFixed(2) + 'px',
 marginTop: parseInt(height / 2, 10) * -1 + 'px'
 }
 break;
 // BULK
 case "NA":
 return {
 width: width + 'px',
 height: height + 'px',
 right: parseFloat(axisPoint - width / 2).toFixed(2) + 'px',
 marginTop: parseInt(height / 2, 10) * -1 + 'px'
 }
 break;
 // DOORS
 case "Y":
 if (lateralAdjust > 0) {
 return {
 width: width + 'px',
 right: parseFloat(axisPoint - width / 2).toFixed(2) + 'px',
 top: 0 + 'px'
 }
 } else if (lateralAdjust < 0) {
 return {
 width: width + 'px',
 right: parseFloat(axisPoint - width / 2).toFixed(2) + 'px',
 bottom: 0 + 'px'
 }
 }
 break;
 default:
 return false;
 }

 };

 console.warn('lowerDeck directive : ', this);
 },

 link: function(scope, element, attrs, ctrl) {}
 }
 }]);
 */

/**
 * Directive: ULD Elements <uld></uld>
 */
/*
 angular.module('AuroraApp')
 .directive('uld', ['FlightFactory', '$routeParams', function TimespanDrctv(FlightFactory, $routeParams) {
 'use strict';

 return {
 restrict: 'EA',
 replace: true,
 scope: true,
 templateUrl: "app/directives/uldItems.tmpl.html",
 controllerAs: 'uldItems',

 controller: function() {
 this.layout = {};
 this.fixedWidth = 1200;

 var flight = FlightFactory.getFlight($routeParams);
 if (flight) {
 flight.then(angular.bind(this, function(response) {
 this.layout = response.lowerDeckLayout;
 this.scaledWidth = FlightFactory.px2InchRatio(this.fixedWidth, this.layout.deckLength);
 }));
 }

 this.setStyle = function(width, height, uld_compatibility_group) {
 var width = parseFloat(width * this.scaledWidth).toFixed(3);
 var height = parseFloat(height * this.scaledWidth).toFixed(3);
 var compatibility = uld_compatibility_group;

 return {
 width: width + 'px',
 height: height + 'px',
 marginTop: parseInt(height / 2, 10) * -1 + 'px'
 };
 }

 console.warn('uld directive : ', this);
 },

 link: function(scope, element, attrs, ctrl) {}
 }
 }]);
 */


/**
 * Directive: data-draggable
 */
angular.module('AuroraApp')
    .directive('draggable', ['$timeout', function($timeout) {
        'use strict';

        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element, attrs) {
                $timeout(function() {
                    var dropTarget = $('.compatibilityClass' + attrs.draggable).not('.uld_assigned');

                    element.draggable({
                        start: function() {
                            console.log('START!');
                            $('.lowerDeck').addClass('workingWith' + attrs.draggable);
                        },
                        drag: function() {
                            console.log('DRAG!');
                        },
                        stop: function() {
                            $('.lowerDeck').removeClass('workingWith' + attrs.draggable);
                            console.log('STOP!');
                        },
                        revert: function(event, ui) {
                            return !event;
                        },
                        addClasses: false,
                        opacity: 0.5,
                        scope: 'compatible' + attrs.draggable,
                        zIndex: 200,
                        cursor: "move",
                        containment: '.container_page',
                        snap: '.centroids.compatibilityClass' + attrs.draggable,
                        snapMode: 'inner',
                        snapTolerance: 30,
                        refreshPositions: true // This solves issues on highly dynamic pages, but dramatically decreases performance
                    });

                    dropTarget.droppable({
                        scope: 'compatible' + attrs.draggable,
                        activeClass: 'toDropHere',
                        drop: function(event, ui) {
                            console.warn('New XHR here!!!!!!');
                            $(this).addClass('uld_assigned');
                            // $(this).droppable('destroy');
                            $(this).droppable('disable');
                            // ui.draggable.draggable('destroy', 1);
                            ui.draggable.draggable('disable', 1);
                            $(this).css("background-color", "");

                        },
                        over: function(event, ui) {
                            $(this).css("background-color", "pink");
                        },
                        out: function(event, ui) {
                            $(this).css("background-color", "");
                        }
                    });

                }, 0);
            }
        };
    }]);


/**
 * Directive: data-has-tipsy
 */
angular.module('AuroraApp')
    .directive('hasTipsy', function() {
        'use strict';

        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element, attrs) {
                element.tipsy({
                    gravity: 's',
                    html: true
                });
            }
        };
    });


angular.module('AuroraApp')
    .directive('numbersOnly', function() {
        'use strict';

        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function(inputValue) {
                    // this next if is necessary for when using ng-required on your input. 
                    // In such cases, when a letter is typed first, this parser will be called
                    // again, and the 2nd time, the value will be undefined
                    if (inputValue == undefined) return ''
                    var transformedInput = inputValue.replace(/[^0-9]/g, '');
                    if (transformedInput != inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return transformedInput;
                });
            }
        };
    });


/**
 * Filter: Gets an object property as a number, and returns an array
 */
angular.module('AuroraApp')
    .filter('getArrayFilter', function() {
        'use strict';

        return function(input, total, preselected_length) {
            // console.log(input, total, preselected_length);
            total = ((typeof preselected_length === 'number') ? parseInt(preselected_length) : parseInt(total));
            for (var i = 0; i < total; i++) {
                input.push(i);
            }
            // console.log(input);
            return input;
        };
    });

/**
 * Filter: Gets an object property as a number, and returns an array
 */
angular.module('AuroraApp')
    .filter('numberFixedLen', function() {
        return function(n, len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = '' + num;
            while (num.length < len) {
                num = '0' + num;
            }
            return num;
        };
    });
