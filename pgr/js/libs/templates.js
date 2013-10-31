angular.module('pgrModule').run(['$templateCache', function($templateCache) {
$templateCache.put('views/changeEmail.html', "<div class=\"email login\" ng-if=\"workspace.user\">\r\n    <div class=\"modal\">\r\n        <div class=\"modal_wrapper\">\r\n            <div class=\"header\">\r\n               <h4>Change email</h4>\r\n            </div>\r\n            <div class=\"body\">\r\n                <ng-form id=\"login_form\" novalidate name=\"ReemailForm\" class=\"css-form myForm\" >\r\n                    <p>\r\n                        <input \r\n                            id=\"login_i\" \r\n                            class=\"form-input\"\r\n                            ng-model=\"form.oldEmail\"\r\n                            required \r\n                            ng-minlength=\"6\"\r\n                            placeholder=\"Current email\"\r\n                            type=\"email\" />\r\n                    </p>\r\n                    <p>\r\n                        <input \r\n                            type=\"email\" \r\n                            id=\"pass_i\"\r\n                            class=\"form-input\"\r\n                            ng-model=\"form.newEmail\"\r\n                            required \r\n                            ng-minlength=\"6\"\r\n                            placeholder=\"New email\" /> \r\n                    </p>\r\n                    <p class=\"errors\" ng-if=\"error\">{{error}}</p>\r\n                    <p>\r\n                        <input \r\n                            ng-disabled=\"ReemailForm.$invalid\"\r\n                            ng-click=\"onChangeEmail()\" \r\n                            type=\"button\" \r\n                            value=\"Save\" />\r\n                    </p>\r\n                </ng-form>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n");
$templateCache.put('views/changePassword.html', "<div class=\"email login\" ng-if=\"workspace.user\">\r\n    <div class=\"modal\">\r\n        <div class=\"modal_wrapper\">\r\n            <div class=\"header\">\r\n               <h4>Change password</h4>\r\n            </div>\r\n            <div class=\"body\">\r\n                <ng-form id=\"login_form\" name=\"RepasswordForm\" novalidate class=\"css-form myForm\" >\r\n                    <p>\r\n                        <input \r\n                            id=\"login_i\" \r\n                            class=\"form-input\"\r\n                            ng-model=\"form.oldPassword\"\r\n                            required \r\n                            ng-minlength=\"6\"\r\n                            placeholder=\"Current password\"\r\n                            type=\"password\" />\r\n                    </p>\r\n                    <p>\r\n                        <input \r\n                            type=\"password\" \r\n                            id=\"pass_i\"\r\n                            class=\"form-input\"\r\n                            ng-model=\"form.newPassword\"\r\n                            required \r\n                            ng-minlength=\"6\"\r\n                            placeholder=\"New password\" /> \r\n                    </p>\r\n                    <p>\r\n                        <input \r\n                            type=\"password\" \r\n                            id=\"pass_i\"\r\n                            class=\"form-input\"\r\n                            ng-model=\"form.confirmPassword\"\r\n                            required \r\n                            ng-minlength=\"6\"\r\n                            placeholder=\"Confirm password\" /> \r\n                    </p>\r\n                    <p class=\"errors\" ng-if=\"error\">{{error}}</p>\r\n                    <p>\r\n                        <input \r\n                            ng-disabled=\"RepasswordForm.$invalid\"\r\n                            ng-click=\"onChangePassword()\" \r\n                            type=\"button\" \r\n                            value=\"Save\" />\r\n                    </p>\r\n                </ng-form>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n");
$templateCache.put('views/graphs.html', "<table id=\"graphs\">\r\n\t<tbody>\r\n\t\r\n\t\t<tr ng-repeat=\"(lKey,lItem) in leagues | orderBy:'position':true\"\t>\r\n\t\t\t<th>\r\n\t\t\t\t{{(lItem.position+1)*10000}}\r\n\t\t\t</th>\r\n\t\t\t<td ng-repeat=\"(uKey,uItem) in lItem.users\" points\" data-points=\"{{uItem.points}}\" data-step=\"{{lItem.position+1}}\">\r\n\t\t\t\t<a ng-if=\"uItem.name\" href=\"#/profile/{{uItem.sguid}}\">\r\n\t\t\t\t\t<img ng-if=\"uItem.avatar\" ng-src=\"{{uItem.avatar}}\" />\r\n\t\t\t\t\t<img ng-if=\"!uItem.avatar\" src=\"./images/unknown-person.png\" />\t\r\n\t\t\t\t</a>\r\n\t\t\t</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<th>\r\n\t\t\t\t0\r\n\t\t\t</th>\r\n\t\t\t<td >\r\n\t\t\t\t\r\n\t\t\t</td>\r\n\t\t\t<td >\r\n\t\t\t\t\r\n\t\t\t</td>\r\n\t\t\t<td >\r\n\t\t\t\t\r\n\t\t\t</td>\r\n\t\t\t<td >\r\n\t\t\t\t\r\n\t\t\t</td>\r\n\t\t\t<td >\r\n\t\t\t\t\r\n\t\t\t</td>\r\n\t\t\t<td >\r\n\t\t\t\t\r\n\t\t\t</td>\r\n\t\t\t<td >\r\n\t\t\t\t\r\n\t\t\t</td>\r\n\t\t\t<td >\r\n\t\t\t\t\r\n\t\t\t</td>\r\n\t\t\t<td >\r\n\t\t\t\t\r\n\t\t\t</td>\r\n\t\t\t<td >\r\n\t\t\t\t\r\n\t\t\t</td>\r\n\t\t</tr>\r\n\t</tbody>\r\n</table>\r\n\r\n<ul id=\"loosers\">\r\n\t<li ng-repeat=\"(uKey,uItem) in looserUser\">\r\n\t\t<a ng-if=\"uItem\" href=\"#/profile/{{uItem.sguid}}\">\r\n\t\t\t<img ng-if=\"uItem.avatar\" ng-src=\"{{uItem.avatar}}\" />\r\n\t\t\t<img ng-if=\"!uItem.avatar\" src=\"./images/unknown-person.png\" />\t\r\n\t\t</a>\r\n\t</li>\r\n</ul>");
$templateCache.put('views/leagues.html', "<section class=\"leaglist\">\r\n\t<article ng-repeat=\"(leaguesKey, leagueItem) in leagues\">\r\n\t\t<a>\r\n\t\t\t<img ng-if=\"leagueItem.name == '1'\" src=\"/images/I.png\" />\r\n\t\t\t<img ng-if=\"leagueItem.name == '2'\" src=\"/images/II.png\" />\r\n\t\t\t<img ng-if=\"leagueItem.name == '3'\" src=\"/images/III.png\" />\r\n\t\t\t<img ng-if=\"leagueItem.name == '4'\" src=\"/images/IV.png\" />\r\n\t\t\t<img ng-if=\"leagueItem.name == '5'\" src=\"/images/V.png\" />\r\n\t\t\t<img ng-if=\"leagueItem.name == '6'\" src=\"/images/VI.png\" />\r\n\t\t\t<img ng-if=\"leagueItem.name == '7'\" src=\"/images/VII.png\" />\r\n\t\t\t<img ng-if=\"leagueItem.name == '8'\" src=\"/images/VIII.png\" />\r\n\t\t\t<img ng-if=\"leagueItem.name == '9'\" src=\"/images/IX.png\" />\r\n\t\t\t<img ng-if=\"leagueItem.name == '10'\" src=\"/images/X.png\" />\r\n\t\t</a>\r\n\t\t<div>\r\n\t\t\t<sub></sub>\r\n\t\t\t<sup></sup>\r\n\t\t\t<p>\r\n\t\t\t\t<a href=\"#/profile/{{userValue.sguid}}\" ng-repeat=\"(userKey, userValue) in leagueItem.users\">\r\n\t\t\t\t\t<img ng-src=\"{{userValue.avatar}}\" alt=\"\" err-src=\"/images/unknown-person.png\" />\r\n\t\t\t\t</a>\r\n\t\t\t</p>\r\n\t\t</div>\r\n\t</article>\r\n</section>");
$templateCache.put('views/login.html', "<div class=\"login\">\r\n    <div class=\"modal\">\r\n        <div class=\"modal_wrapper\">\r\n            <div class=\"header\" ng-if=\"signup\">\r\n               <h4>Sing up to SIRating</h4>\r\n               <p>Use Facebook, Twitter, Google+, Improva or your email to sign up.</p>\r\n               <p>Don’t have a SIRating account yet? <a ng-click=\"onSignStateChange()\">Sign in </a>now.</p>\r\n            </div>\r\n            <div class=\"header\" ng-if=\"!signup\">\r\n               <h4>Sing in to SIRating</h4>\r\n               <p>Use Facebook, Twitter, Google+, Improva or your email to sign in.</p> \r\n               <p>Do already have a SIRating account? <a ng-click=\"onSignStateChange()\">Sign up </a>now.</p>\r\n            </div>\r\n            <div class=\"body\">\r\n                <div class=\"left\">\r\n                    <div class=\"left_wrapper\">\r\n                        <ul>\r\n                            <li>\r\n                                <a ng-click=\"socialFacebookLogin()\">\r\n                                    <img src=\"/images/facebook.png\" alt=\"\" />\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                                <a ng-click=\"socialGooglePlusLogin()\">\r\n                                    <img src=\"/images/twitter.png\" alt=\"\" />\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                                <a>\r\n                                    <img src=\"/images/google.png\" alt=\"\" />\r\n                                </a>\r\n                            </li>\r\n                            <li>\r\n                                <a>\r\n                                    <img src=\"/images/improva.png\" alt=\"\" />\r\n                                </a>\r\n                            </li>\r\n                        </ul>\r\n                    </div>\r\n                </div>\r\n                <div class=\"right\">\r\n                    <div class=\"right_wrapper\">\r\n                        <div class=\"sign-up\" ng-show=\"signup\">\r\n                            <ng-form name=\"RegForm\" novalidate class=\"css-form myForm\" >\r\n                                <p>\r\n                                    <input \r\n                                        type=\"text\" \r\n                                        id=\"login_i\" \r\n                                        class=\"form-input\"\r\n                                        ng-model=\"user.login\" \r\n                                        required \r\n                                        ng-minlength=\"6\"\r\n                                        placeholder=\"Name\"\r\n                                        ui-keypress=\"{13:'onKeyPressReg($event)'}\" />\r\n                                </p>\r\n                                <p>\r\n                                    <input \r\n                                        type=\"email\" \r\n                                        id=\"email_i\" \r\n                                        class=\"form-input\"\r\n                                        ng-model=\"user.email\" \r\n                                        required\r\n                                        placeholder=\"Email\"\r\n                                        ui-keypress=\"{13:'onKeyPressReg($event)'}\"  /> \r\n                                </p>\r\n                                <p>\r\n                                    <input \r\n                                        type=\"password\" \r\n                                        id=\"name_i\" \r\n                                        class=\"form-input\"\r\n                                        ng-model=\"user.password\" \r\n                                        required \r\n                                        ng-minlength=\"6\"\r\n                                        placeholder=\"Choose a Password\"\r\n                                        ui-keypress=\"{13:'onKeyPressReg($event)'}\" /> \r\n                                </p>\r\n                                <p class=\"tip\">Make it 6-25 characters</p>\r\n                                <p class=\"errors\" ng-if=\"error\">{{errors}}</p>\r\n                                <p>\r\n                                    <input \r\n                                        type=\"button\" \r\n                                        value=\"Sign up\"\r\n                                        ng-disabled=\"RegForm.$invalid\"\r\n                                        ng-click=\"onAddUser()\" />\r\n                                </p>\r\n                            </ng-form>\r\n                        </div>\r\n                        <div class=\"sign-in\" ng-show=\"!signup\">\r\n                            <ng-form \r\n                                id=\"login_form\" \r\n                                name=\"LoginForm\" \r\n                                novalidate \r\n                                class=\"css-form myForm\" >\r\n                                <p>\r\n                                    <input \r\n                                        type=\"text\" \r\n                                        id=\"login_i\" \r\n                                        class=\"form-input\"\r\n                                        ng-model=\"login.login\"\r\n                                        required \r\n                                        ng-minlength=\"6\"\r\n                                        placeholder=\"Email or Username\"\r\n                                        ui-keypress=\"{13:'onKeyPress($event)'}\" />\r\n                                </p>\r\n                                <p>\r\n                                    <input \r\n                                        type=\"password\" \r\n                                        id=\"pass_i\"\r\n                                        class=\"form-input\"\r\n                                        ng-model=\"login.password\"\r\n                                        required \r\n                                        ng-minlength=\"6\"\r\n                                        placeholder=\"Password\"\r\n                                        ui-keypress=\"{13:'onKeyPress($event)'}\" /> \r\n                                </p>\r\n                                <p>\r\n                                    <a href=\"#\">Forgot your password?</a>\r\n                                </p>\r\n                                <p>\r\n                                    <input type=\"checkbox\" />\r\n                                    <label>Keep me sign in</label>\r\n                                </p>\r\n                                <p class=\"errors\" ng-if=\"error\">{{error}}</p>\r\n                                <p>\r\n                                    <input \r\n                                        ng-disabled=\"LoginForm.$invalid\"\r\n                                        ng-click=\"onSingin()\" \r\n                                        type=\"button\" \r\n                                        value=\"Sign in\"\r\n                                        ui-keypress=\"{13:'onKeyPress($event)'}\" />\r\n                                </p>\r\n                            </ng-form>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n");
$templateCache.put('views/main.html', "<section \r\n\tmsd-wheel=\"onWheel($event, $delta, $deltaX, $deltaY)\"\r\n\thm-dragleft=\"onDrag($event)\"\r\n\thm-dragright=\"onDrag($event)\"\r\n\tclass=\"gallery\" ng-controller=\"GalleryController\">\r\n\t<div isotope-container iso-options=\"opts\" ng-style=\"{left: scrollDelta}\" >\r\n\t\t<div\r\n\t\t\tng-mouseenter=\"onUserMouseEnter(userItem, $event)\"\r\n\t\t\tng-mouseleave=\"onUserMouseLeave(userItem, $event)\"\r\n\t\t\tng-click=\"onUserClick(userItem, $event)\"\r\n\t\t\tng-class=\"{big: userItem.hover, 'full-animate': userItem.fullAnimate}\"\r\n\t\t\tclass=\"league_{{userItem.league.name}} isotope\" \r\n\t\t\tng-repeat=\"userItem in users\"\r\n\t\t\thm-dragleft=\"onDrag($event)\"\r\n\t\t\thm-dragright=\"onDrag($event)\" >\r\n\t\t\t<div set-width class=\"wr\" back-img=\"{{userItem.avatar}}\" ng-click=\"switchState(userItem)\" >\r\n\t\t\t\t<i>{{userItem.points}}</i>\r\n\t\t\t\t<div class=\"sub\">\r\n\t\t\t\t\t<b>{{userItem.name}} <br /><s>{{userItem.league.name}} league</s></b>\r\n\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t<a ng-click=\"onMoveToProfile(userItem)\">\r\n\t\t\t\t\t\t\t\t<span class=\"icon profile navigate\"></span>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t<a href=\"\">\r\n\t\t\t\t\t\t\t\t<span class=\"icon compare navigate\"></span>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t<a ng-if=\"!userItem.isFrend\" ng-click=\"onFollow(userItem)\">\r\n\t\t\t\t\t\t\t\t<span class=\"icon follow navigate\"></span>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t\t<a ng-if=\"userItem.isFrend\" ng-click=\"onUnFollow(userItem)\">\r\n\t\t\t\t\t\t\t\t<span class=\"icon unfollow navigate\"></span>\r\n\t\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t</li>\r\n\t\t\t\t\t</ul>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</section>\r\n");
$templateCache.put('views/my_profile.html', "<div class=\"mynav\" ng-if=\"workspace.user\">\r\n\t<ul>\r\n\t\t<li ng-click=\"onChange(1)\" ng-class=\"{current: tab == 1}\">\r\n\t\t\t<a>\r\n\t\t\t\t<span square class=\"icon myprofile profile\" ng-class=\"{current: tab == 1}\"></span>\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t\t<li ng-click=\"onChange(2)\" ng-class=\"{current: tab == 2}\">\r\n\t\t\t<a>\r\n\t\t\t\t<span square class=\"icon myprofile dash\" ng-class=\"{current: tab == 2}\"></span>\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t\t<li ng-click=\"onChange(3)\" ng-class=\"{current: tab == 3}\">\r\n\t\t\t<a>\r\n\t\t\t\t<span square class=\"icon myprofile settings\" ng-class=\"{current: tab == 3}\"></span>\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t</ul>\r\n\t<h2 ng-if=\"tab == 1\">\r\n\t\tProfile\r\n\t</h2>\r\n\t<h2 ng-if=\"tab == 2\">\r\n\t\tDashboard\r\n\t</h2>\r\n\t<h2 ng-if=\"tab == 3\">\r\n\t\tSettings\r\n\t</h2>\r\n</div>\r\n\r\n<div ng-if=\"tab == 1 && workspace.user\" class=\"tab\">\r\n\t<section class=\"tab\" ng-include src=\"'partials/myprofile.html'\" ></section>\r\n</div>\r\n<div ng-if=\"tab == 2 && workspace.user\" class=\"tab\">\r\n\t<section class=\"tab\" ng-include src=\"'partials/mydash.html'\" ></section>\r\n</div>\r\n<div ng-if=\"tab == 3 && workspace.user\" class=\"tab\">\r\n\t<section class=\"tab\" ng-include src=\"'partials/mysettings.html'\" ></section>\r\n</div>");
$templateCache.put('views/profile.html', "<section class=\"promain\" ng-include src=\"'partials/user.html'\" ></section>\r\n\r\n<section ng-controller=\"CompareController\" class=\"pronear\" id=\"compare\" app-view-segment=\"1\"></section>");
$templateCache.put('partials/compare.html', "<div class=\"comp\" ng-include src=\"'partials/user.html'\" ng-controller=\"UserController\" ng-init=\"currentUserId=routeUserId;allUser=false;isEdit=false;\"></div>");
$templateCache.put('partials/follow.html', "<section ng-controller=\"FollowController\" >\r\n\t<div id=\"follow_tab\" ng-if=\"frends.length > 0\">\r\n\t\t<img class=\"fuck\" src=\"/images/f.png\" alt=\"\" />\r\n\t\t<ul>\r\n\t\t\t<li \r\n\t\t\t\tng-class=\"{show: userItem.user.show}\" \r\n\t\t\t\tng-mouseleave=\"onMouseLeaveUser(userItem.user)\" \r\n\t\t\t\tng-click=\"onMouseEnterUser(userItem.user)\" \r\n\t\t\t\tng-mouseenter=\"onMouseEnterUser(userItem.user)\" \r\n\t\t\t\tng-repeat=\"userItem in frends\">\r\n\t\t\t\t<img \r\n\t\t\t\t\tng-click=\"onCompare(userItem.user)\" \r\n\t\t\t\t\tng-src=\"{{userItem.user.avatar}}\" \r\n\t\t\t\t\talt=\"\" \r\n\t\t\t\t\terr-src=\"/images/unknown-person.png\" />\r\n\t\t\t</li>\r\n\t\t</ul>\r\n\t\t<a ng-click=\"onMoveToUser()\"></a>\r\n\t</div>\r\n</section>");
$templateCache.put('partials/gallery.html', "<div class=\"galblo\">\r\n\t<div class=\"galblos isotope\"\r\n\t\tng-repeat=\"(userKey, userItem) in users\"\r\n\t\tng-mouseenter=\"onUserMouseEnter(userItem, $event)\"\r\n\t\tng-mouseleave=\"onUserMouseLeave(userItem, $event)\"\r\n\t\tng-click=\"onUserClick(userItem, $event)\"\r\n\t\tng-class=\"{big: userItem.hover}\"\r\n\t\tng-if=\"userItem.showItem\">\r\n\t\t<img ng-src=\"{{userItem.avatar}}\" err-src=\"/images/unknown-person.png\" />\r\n\t\t<span>{{userItem.points}}</span>\r\n\t\t<div class=\"sub\"> \r\n\t\t\t<b>{{userItem.name}} <br /><s>{{userItem.league.name}} league</s></b>\r\n\t\t\t<ul>\r\n\t\t\t\t<li>\r\n\t\t\t\t\t<a ng-click=\"onMoveToProfile(userItem)\">\r\n\t\t\t\t\t\t<span class=\"icon profile navigate\"></span>\r\n\t\t\t\t\t</a>\r\n\t\t\t\t</li>\r\n\t\t\t\t<li>\r\n\t\t\t\t\t<a href=\"\">\r\n\t\t\t\t\t\t<span class=\"icon compare navigate\"></span>\r\n\t\t\t\t\t</a>\r\n\t\t\t\t</li>\r\n\t\t\t\t<li>\r\n\t\t\t\t\t<a ng-if=\"!userItem.isFrend\" ng-click=\"onFollow(userItem)\">\r\n\t\t\t\t\t\t<span class=\"icon follow navigate\"></span>\r\n\t\t\t\t\t</a>\r\n\t\t\t\t\t<a ng-if=\"userItem.isFrend\" ng-click=\"onUnFollow(userItem)\">\r\n\t\t\t\t\t\t<span class=\"icon unfollow navigate\"></span>\r\n\t\t\t\t\t</a>\r\n\t\t\t\t</li>\r\n\t\t\t</ul>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n\r\n<sub ng-if=\"swipe > 0\" ng-click=\"onSwipeLeft()\"><img src=\"../images/left.png\"></sub>\r\n<sup ng-if=\"users.length > limit && swipe < swipeMax - 1\" ng-click=\"onSwipeRight()\"><img src=\"../images/right.png\"></sup>");
$templateCache.put('partials/leagues.html', "<section class=\"leaglist\">\r\n\t<a ng-click=\"onLeagUser(item)\" ng-class=\"{curleag:item.curleag}\" ng-repeat=\"(key, item) in leagues\">\r\n\t\t<img ng-if=\"key == 0\" src=\"/images/I.png\" />\r\n\t\t<img ng-if=\"key == 1\" src=\"/images/II.png\" />\r\n\t\t<img ng-if=\"key == 2\" src=\"/images/III.png\" />\r\n\t\t<img ng-if=\"key == 3\" src=\"/images/IV.png\" />\r\n\t\t<img ng-if=\"key == 4\" src=\"/images/V.png\" />\r\n\t\t<img ng-if=\"key == 5\" src=\"/images/VI.png\" />\r\n\t\t<img ng-if=\"key == 6\" src=\"/images/VII.png\" />\r\n\t\t<img ng-if=\"key == 7\" src=\"/images/VIII.png\" />\r\n\t\t<img ng-if=\"key == 8\" src=\"/images/IX.png\" />\r\n\t\t<img ng-if=\"key == 9\" src=\"/images/X.png\" />\r\n\t</a>\r\n</section>");
$templateCache.put('partials/loader.html', "<div id=\"modal-shadow\" ng-controller=\"LoaderController\">\r\n\t<img src=\"/images/rotate.png\" alt=\"\" class=\"rotating\" />\r\n</div>");
$templateCache.put('partials/mydash.html', "<section class=\"mydash\">\r\n\t<p>My dashboard will be here</p>\r\n</section>");
$templateCache.put('partials/myprofile.html', "<div ng-controller=\"NeedsAndGoalsController\" class=\"tab\" ng-init=\"user = workspace.user; openFirst = true; allOpen = true; persistState = true;\">\r\n\r\n\t<b id=\"bridge\" bridge></b>\r\n\r\n\t<section class=\"mypro acrd\">\r\n\t\t<div class=\"crits\">\r\n\t\t\t<ul> \r\n\t\t\t\t<li ng-repeat=\"(needKey, needItem) in needs | orderBy:'position'\" data-needId=\"{{needItem.sguid}}\">\r\n\t\t\t\t\t<div class=\"cr\" ng-click=\"onShowGoals($event, needItem)\">\r\n\t\t\t\t\t\t<p>{{needItem.name}}</p>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<ul ng-class=\"{current: needItem.current}\">\r\n\t\t\t\t\t\t<li ng-repeat=\"(goalKey,goalItem) in needItem.goals | orderBy:'position'\" data-goalid=\"{{goalItem.sguid}}\" >\r\n\t\t\t\t\t\t\t<h5 ng-class=\"{current: goalItem.current}\">\r\n\t\t\t\t\t\t\t\t<a ng-click=\"openCriteriumList($event, needItem, goalItem, needs)\">\r\n\t\t\t\t\t\t\t\t\t<span><img ng-src=\"{{goalItem.icon}}\" alt=\"\" title=\"{{goalItem.name}}\" /></span>\r\n\t\t\t\t\t\t\t\t\t{{goalItem.name}}\r\n\t\t\t\t\t\t\t\t</a>\t\r\n\t\t\t\t\t\t\t\t<div class=\"right\">\r\n\t\t\t\t\t\t\t\t\t<strong>\r\n\t\t\t\t\t\t\t\t\t\t<span class=\"current_position\" style=\"width: {{(goalItem.current_value / (goalItem.points_summary ))*100}}%;\"></span>\r\n\t\t\t\t\t\t\t\t\t</strong>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</h5>\r\n\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t</li>\r\n\t\t\t\t\t</ul>\r\n\t\t\t\t</li>\r\n\t\t\t</ul>\r\n\t\t</div>\r\n\t</section>\r\n\r\n\t<section class=\"mypro\">\r\n\t\t<div class=\"crits\" ng-if=\"currentGoal\">\r\n\t\t\t<h5>\r\n\t\t\t\t<a>\r\n\t\t\t\t\t<span><img ng-src=\"{{currentGoal.icon}}\" alt=\"\" title=\"{{currentGoal.name}}\" /></span>\r\n\t\t\t\t\t{{currentGoal.name}}\r\n\t\t\t\t</a>\t\r\n\t\t\t\t<div class=\"right\" ng-if=\"currentGoal.current_value\">\r\n\t\t\t\t\t<b>{{currentGoal.current_value}} / {{currentGoal.points_summary}}</b>\r\n\t\t\t\t\t<strong>\r\n\t\t\t\t\t\t<span class=\"current_position\" style=\"width: {{(currentGoal.current_value / (currentGoal.points_summary ))*100}}%;\"></span>\r\n\t\t\t\t\t</strong>\r\n\t\t\t\t</div>\r\n\t\t\t</h5>\r\n\t\t\t<ul class=\"criterion\">\r\n\t\t\t\t<li data-id=\"{{crItem.sguid}}\" ng-repeat=\"crItem in currentGoal.criteriums | orderBy:'position'\" >\r\n\t\t\t\t\t<p>{{crItem.name}}</p>\r\n\t\t\t\t\t<div class=\"bord\">\r\n\t\t\t\t\t\t<ul class=\"crp\">\r\n\t\t\t\t\t\t\t<div class=\"tab\">\r\n\t\t\t\t\t\t\t\t<li data-id=\"{{value.sguid}}\"  \r\n\t\t\t\t\t\t\t\t\tng-repeat=\"value in crItem.criteria_values | orderBy:'position'\"  \r\n\t\t\t\t\t\t\t\t\tclass=\"{{value.user_criteria}} position_{{value.position}}\" ng-click=\"onCriteriaSelect(value, crItem, $event, currentNeed, currentGoal)\">\r\n\t\t\t\t\t\t\t\t\t<i ng-if=\"value.sguid != 'none'\">{{value.name}}</i>\r\n\t\t\t\t\t\t\t\t\t<i ng-if=\"value.sguid == 'none'\" class=\"null_criteria\"></i>\r\n\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t<span>\r\n\t\t\t\t\t\t\t\t<img src=\"../images/ar.png\" alt=\"\" />\r\n\t\t\t\t\t\t\t</span>\r\n\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</li>\r\n\t\t\t</ul>\r\n\t\t</div>\r\n\t</section>\r\n</div>\r\n");
$templateCache.put('partials/mysettings.html', "<div ng-controller=\"CropImageController\"  >\r\n\t<div ng-class=\"{show: show}\" id=\"crop_modal\">\r\n\t\t<div class=\"modal-body\">\r\n\t\t\t<form action=\"\" method=\"get\" accept-charset=\"utf-8\">\r\n\t\t\t\t<div id='cropContainer'>\r\n\t\t\t      <div class=\"cropper\">\r\n\t\t\t         <div class=\"preview-container\">\r\n\t\t\t         \t<img src=\"\" id=\"crop_img\" alt=\"\" />\r\n\t\t        \t\t<canvas id=\"image_canvas\"></canvas>\r\n\t\t\t         </div>\r\n\t\t\t      </div>\r\n\t\t\t   </div>\r\n\t\t   </form>\r\n\t\t</div>\r\n\t\t<div class=\"buttons\">\r\n\t\t\t<button ng-click=\"close()\">Cancel</button>\r\n\t\t\t<button class=\"apply\" ng-click=\"onSend()\">Apply</button>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n<section class=\"myset\">\r\n\t<div \r\n\t\tclass=\"pmain pro promy\" \r\n\t\tng-controller=\"UserController\" >\r\n\t\t<div class=\"block\">\r\n\t\t\t<input class=\"hidden\" id=\"photo_crop\" onchange=\"angular.element(this).scope().onReadFile()\" capture=\"camera\" type=\"file\" accept=\"image/*\" />\r\n\t\t\t\r\n\t\t\t<div class=\"image_box\" ng-click=\"onUpdateFile()\">\r\n\t\t\t\t<img class=\"pp\" ng-src=\"{{workspace.user.avatar}}\" err-src=\"/images/unknown-person.png\" />\r\n\t\t\t</div>\r\n\t\t\t\r\n\t\t\t<div class=\"publish\" ng-if=\"workspace.user.published == 0\">\r\n\t\t\t\t<p>\r\n\t\t\t\t\t<strong>Your account is private.<b>Only you can see your profile.</b></strong>\r\n\t\t\t\t\t<button ng-click=\"onPublish()\">{{'_PublishL_' | i18n}}</button>\r\n\t\t\t\t</p>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"publish\" ng-if=\"workspace.user.published == 1\">\r\n\t\t\t\t<p>\r\n\t\t\t\t\t<strong>Your account is public.<b>Everybody can see you profile.</b></strong>\r\n\t\t\t\t\t<button ng-click=\"onUnPublish()\">Make it private</button>\r\n\t\t\t\t</p>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\r\n\t\t<div class=\"pmpar\">\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"name_i\">{{'_NameL_' | i18n}}:</label> \r\n\t\t\t\t<input \r\n\t\t\t\t\ttype=\"text\" \r\n\t\t\t\t\tid=\"name_i\" \r\n\t\t\t\t\tng-model=\"workspace.user.name\"\r\n\t\t\t\t\trequired\r\n\t\t\t\t\tng-minlength=\"6\" />\r\n\t\t\t</p>\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"age_i\">{{'_BirthdayL_' | i18n}}:</label>\r\n\t\t\t\t<input \r\n\t\t\t\t\ttype=\"datetime\"\r\n\t\t\t\t\tng-model=\"workspace.user.birthdayDate\"\r\n\t\t\t\t\tui-date=\"dateOptions\"\r\n\t\t\t\t\tid=\"age_i\" />\r\n\t\t\t</p>\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"loc_i\">{{'_LocL_' | i18n}}:</label>\r\n\t\t\t\t<input \r\n\t\t\t\t\tid=\"pro_i\" \r\n\t\t\t\t\tng-model=\"workspace.user.state.name\"\r\n\t\t\t\t\ttype=\"text\" ui-autocomplete=\"stateOption\"  />\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"pro_i\">{{'_ProfL_' | i18n}}:</label>\r\n\t\t\t\t<input \r\n\t\t\t\t\tid=\"pro_i\" \r\n\t\t\t\t\tng-model=\"workspace.user.profession.name\"\r\n\t\t\t\t\ttype=\"text\" ui-autocomplete=\"professionOption\"  />\r\n\t\t\t</p>\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"email_i\">{{'_EmaiL_' | i18n}}:</label> \r\n\t\t\t\t<input \r\n\t\t\t\t\ttype=\"email\" \r\n\t\t\t\t\tid=\"email_i\" \r\n\t\t\t\t\tng-model=\"workspace.user.email\"\r\n\t\t\t\t\treadonly=\"readonly\"\r\n\t\t\t\t\trequired />\r\n\t\t\t\t\t<button ng-click=\"onChangeEmail()\">{{'_ChaEm_' | i18n}}</button>\r\n\t\t\t</p>\r\n\t\t\t<p ng-controller=\"QuickUserChangeCtrl\">\r\n\t\t\t\t<label for=\"username_i\">{{'_UserName_' | i18n}}:</label> \r\n\t\t\t\t<select \r\n\t\t\t\t\tid=\"acc_i\"\r\n\t\t\t\t\tng-options=\"item.fullname for item in users\" \r\n\t\t\t\t\tng-model=\"nextUser\" \r\n\t\t\t\t\tng-change=\"onMoveUserClick($event, nextUser)\">\r\n\t\t\t\t\t<option value=\"\">{{workspace.user.login}}, {{workspace.user.name}}</option>\r\n\t\t\t\t</select>\r\n\t\t\t\t<button  ng-click=\"onChangePassword()\">{{'_ChaPas_' | i18n}}</button>\r\n\t\t\t</p>\r\n\t\t</div>\r\n\t</div>\r\n</section>");
$templateCache.put('partials/neighbours.html', "<div class=\"nearblock\" ng-controller=\"NeighboursCtrl\">\r\n\t<div ng-controller=\"GalleryController\"  ng-init=\"id='top';title='_topL_'\">\r\n\t\t<div class=\"lnbl\">\r\n\t\t\t<div class=\"gallery\" ng-if=\"users.length > 0\">\r\n\t\t\t\t<h4>{{localTitle}}</h4>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class=\"lnbl\" ng-include src=\"'partials/gallery.html'\"></div>\r\n\t</div>\r\n\t<i></i>\r\n\t<div ng-controller=\"GalleryController\"  ng-init=\"id='neigh';title='_neighL_'\">\r\n\t\t<div class=\"lnbl\" ng-include src=\"'partials/gallery.html'\"></div>\r\n\t</div>\r\n</div>");
$templateCache.put('partials/user.html', "<div ng-controller=\"UserController\">\r\n\t<div class=\"pmain pro\" >\r\n\t\t<div class=\"block\" ng-if=\"user\">\r\n\t\t\t\r\n\t\t\t<div class=\"image_box\" ng-class=\"{updated: user.sguid == authUserId && isEdit}\">\r\n\t\t\t\t<img class=\"pp\" ng-src=\"{{user.avatar}}\" err-src=\"/images/unknown-person.png\" />\r\n\t\t\t\t<i>{{user.points}}</i>\r\n\t\t\t\t<a ng-click=\"onUpdateFile()\" title=\"\">Update image</a>\r\n\t\t\t\t<span></span>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class=\"pmpar\" ng-if=\"user\">\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"name_i\">{{'_NameL_' | i18n}}:</label> \r\n\t\t\t\t<input \r\n\t\t\t\t\ttype=\"text\" \r\n\t\t\t\t\tid=\"name_i\" \r\n\t\t\t\t\tclass=\"clean form-control\" \r\n\t\t\t\t\tng-model=\"user.name\"\r\n\t\t\t\t\treadonly=\"readonly\"\r\n\t\t\t\t\trequired\r\n\t\t\t\t\tng-minlength=\"6\"\r\n\t\t\t\t\tng-click=\"onElementClick($event)\"\r\n\t\t\t\t\tng-if=\"isEdit && user.sguid == authUserId\" />\r\n\t\t\t\t<i ng-if=\"!isEdit || user.sguid != authUserId\">{{user.name}}</i>\r\n\t\t\t</p>\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"age_i\">{{'_BirthdayL_' | i18n}}:</label>\r\n\t\t\t\t<input \r\n\t\t\t\t\ttype=\"text\" \r\n\t\t\t\t\tng-model=\"user.birthday\" \r\n\t\t\t\t\tdata-date-format=\"dd/mm/yyyy\" \r\n\t\t\t\t\tbs-datepicker\r\n\t\t\t\t\treadonly=\"readonly\"\r\n\t\t\t\t\tclass=\"clean form-control\" \r\n\t\t\t\t\tid=\"age_i\"\r\n\t\t\t\t\tng-click=\"onElementClick($event)\"\r\n\t\t\t\t\tng-if=\"isEdit && user.sguid == authUserId\" />\r\n\t\t\t\t<i ng-if=\"!isEdit || user.sguid != authUserId\">{{user.birthday}}</i>\r\n\t\t\t</p>\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"loc_i\">{{'_LocL_' | i18n}}:</label>\r\n\t\t\t\t<select \r\n\t\t\t\t\tng-options=\"item.sguid as item.name for item in states\" \r\n\t\t\t\t\tng-model=\"user.state.sguid\" \r\n\t\t\t\t\treadonly=\"readonly\" \r\n\t\t\t\t\tid=\"loc_i\"\r\n\t\t\t\t\tng-click=\"onElementClick($event)\"\r\n\t\t\t\t\tng-if=\"isEdit && user.sguid == authUserId\">\r\n\t\t\t\t</select>\r\n\t\t\t\t<i ng-if=\"!isEdit || user.sguid != authUserId\">{{user.state.name}}</i>\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"pro_i\">{{'_ProfL_' | i18n}}:</label>\r\n\t\t\t\t<input \r\n\t\t\t\t\tid=\"pro_i\" \r\n\t\t\t\t\tng-if=\"isEdit && user.sguid == authUserId\" \r\n\t\t\t\t\tng-model=\"user.profession.name\" \r\n\t\t\t\t\ttype=\"text\" \r\n\t\t\t\t\tbs-typeahead=\"professionFn\"\r\n\t\t\t\t\treadonly=\"readonly\"\r\n\t\t\t\t\tng-click=\"onElementClick($event)\" />\r\n\t\t\t\t<i ng-if=\"!isEdit || user.sguid != authUserId\">{{user.profession.name}}</i>\r\n\t\t\t</p>\r\n\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"pro_i\">{{'_LEAGUES_' | i18n}}:</label>\r\n\t\t\t\t<i>{{user.league.name}}</i>\r\n\t\t\t</p>\r\n\t\t</div>\r\n\r\n\t\t<a class=\"il\" ng-if=\"user && !user.isFollow\" ng-click=\"onFollow()\"><img src=\"../images/i3l.png\"></a>\r\n\t\t<a class=\"il\" ng-if=\"user && user.isFollow\" ng-click=\"onUnFollow()\"><img src=\"../images/i3i.png\"></a>\r\n\r\n\t\t<a class=\"il\" ng-if=\"user\"><img src=\"../images/i2l.png\"></a> \r\n\t</div>\r\n\r\n\t<div class=\"crits\" ng-controller=\"NeedsAndGoalsController\" ng-init=\"openFirst = false; allOpen = false; persistState = false;\">\r\n\t\t<ul> \r\n\t\t\t<li ng-class=\"{current: needItem.current}\" ng-repeat=\"(needKey, needItem) in needs | orderBy:'position'\" data-needId=\"{{needItem.sguid}}\">\r\n\t\t\t\t<div class=\"cr\" ng-click=\"onShowGoals($event, needItem)\">\r\n\t\t\t\t\t<p>{{needItem.name}}<s></s></p>\r\n\t\t\t\t\t<div class=\"right\" ng-if=\"needItem.current_value\">\r\n\t\t\t\t\t\t<b>{{needItem.current_value}} / {{needItem.points_summary}}</b>\r\n\t\t\t\t\t\t<strong>\r\n\t\t\t\t\t\t\t<span \r\n\t\t\t\t\t\t\t\tclass=\"current_position\" \r\n\t\t\t\t\t\t\t\tstyle=\"width: {{(needItem.current_value / (needItem.points_summary ))*100}}%;\">\r\n\t\t\t\t\t\t\t</span>\r\n\t\t\t\t\t\t</strong>\t\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t<ul ng-class=\"{current: needItem.current}\">\r\n\t\t\t\t\t<li ng-repeat=\"(goalKey,goalItem) in needItem.goals | orderBy:'position'\" data-goalid=\"{{goalItem.sguid}}\" >\r\n\t\t\t\t\t\t<h5>\r\n\t\t\t\t\t\t\t<a \r\n\t\t\t\t\t\t\t\tng-class=\"{current: goalItem.current}\"\r\n\t\t\t\t\t\t\t\tng-click=\"openCriteriumList($event, needItem, goalItem, needs)\">\r\n\t\t\t\t\t\t\t\t<span><img ng-src=\"{{goalItem.icon}}\" alt=\"\" title=\"{{goalItem.name}}\" /></span>\r\n\t\t\t\t\t\t\t\t{{goalItem.name}}\r\n\t\t\t\t\t\t\t\t<s></s>\r\n\t\t\t\t\t\t\t</a>\t\r\n\t\t\t\t\t\t\t<div class=\"right\">\r\n\t\t\t\t\t\t\t\t<b>{{goalItem.current_value}} / {{goalItem.points_summary}}</b>\t\r\n\t\t\t\t\t\t\t\t<strong>\r\n\t\t\t\t\t\t\t\t\t<span class=\"current_position\" style=\"width: {{(goalItem.current_value / (goalItem.points_summary ))*100}}%;\"></span>\r\n\t\t\t\t\t\t\t\t</strong>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t</h5>\r\n\t\t\t\t\t\t<ul class=\"criterion\" ng-class=\"{current: goalItem.current}\">\r\n\t\t\t\t\t\t\t<li data-id=\"{{crItem.sguid}}\" ng-repeat=\"crItem in goalItem.criteriums | orderBy:'position'\" >\r\n\t\t\t\t\t\t\t\t<p>{{crItem.name}}</p>\r\n\t\t\t\t\t\t\t\t<div class=\"bord\">\r\n\t\t\t\t\t\t\t\t\t<ul class=\"crp\">\r\n\t\t\t\t\t\t\t\t\t\t<div class=\"tab\">\r\n\t\t\t\t\t\t\t\t\t\t\t<li data-id=\"{{value.sguid}}\"  \r\n\t\t\t\t\t\t\t\t\t\t\t\tng-repeat=\"value in crItem.criteria_values | orderBy:'position'\"  \r\n\t\t\t\t\t\t\t\t\t\t\t\tclass=\"{{value.user_criteria}} position_{{value.position}}\" \r\n\t\t\t\t\t\t\t\t\t\t\t\tng-click=\"onCriteriaSelect(value, crItem, $event, needItem, goalItem)\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t<i ng-if=\"value.sguid != 'none'\">{{value.name}}</i>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<i ng-if=\"value.sguid == 'none'\" class=\"null_criteria\"></i>\r\n\t\t\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t<span>\r\n\t\t\t\t\t\t\t\t\t\t\t<img src=\"../images/ar.png\">\r\n\t\t\t\t\t\t\t\t\t\t</span>\r\n\t\t\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t\t\t<strong><img src=\"../images/com.png\"></strong>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t</li>\r\n\t\t\t\t\t\r\n\t\t\t\t</ul>\r\n\t\t\t</li>\r\n\t\t</ul>\r\n\t</div>\r\n</div>");
}]);