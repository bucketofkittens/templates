/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/


var router = new geddy.RegExpRouter();

router.get('/').to('Main.index');
router.match('/api/news', 'GET').to('News.list');
router.match('/api/news/:id', 'GET').to('News.one');
router.match('/api/news/delete/:id', 'GET').to('News.destroy');
router.match('/api/news/create', 'POST').to('News.create');
router.match('/api/news/delete/:id', 'GET').to('News.destroy');

router.match('/api/newsnav', 'GET').to('Newsnav.list');
router.match('/api/newsnav/:id', 'GET').to('Newsnav.one');
router.match('/api/newsnav/create', 'POST').to('Newsnav.create');
router.match('/api/newsnav/delete/:id', 'GET').to('Newsnav.destroy');

router.match('/api/event', 'GET').to('Event.list');
router.match('/api/event/create', 'POST').to('Event.create');
router.match('/api/event/delete/:id', 'GET').to('Event.destroy');

router.match('/api/hall', 'GET').to('Hall.list');
router.match('/api/hall/create', 'POST').to('Hall.create');
router.match('/api/hall/delete/:id', 'GET').to('Hall.destroy');

router.match('/api/structure', 'GET').to('Struct.list');
router.match('/api/structure/create', 'POST').to('Struct.create');
router.match('/api/structure/delete/:id', 'GET').to('Struct.destroy');

router.match('/api/newspaper', 'GET').to('Newspaper.list');
router.match('/api/newspaper/create', 'POST').to('Newspaper.create');
router.match('/api/newspaper/delete/:id', 'GET').to('Newspaper.destroy');

router.match('/api/auth/login', 'POST').to('Auth.authenticate');
router.match('/api/auth/status', 'GET').to('Auth.status');
router.match('/api/auth/logout', 'GET').to('Auth.logout');

// Basic routes
// router.match('/moving/pictures/:id', 'GET').to('Moving.pictures');
//
// router.match('/farewells/:farewelltype/kings/:kingid', 'GET').to('Farewells.kings');
//
// Can also match specific HTTP methods only
// router.get('/xandadu').to('Xanadu.specialHandler');
// router.del('/xandadu/:id').to('Xanadu.killItWithFire');
//
// Resource-based routes
// router.resource('hemispheres');
//
// Nested Resource-based routes
// router.resource('hemispheres', function(){
//   this.resource('countries');
//   this.get('/print(.:format)').to('Hemispheres.print');
// });


router.get('/login').to('Main.login');
router.get('/logout').to('Main.logout');

router.resource('users');
router.resource('messages');
exports.router = router;
