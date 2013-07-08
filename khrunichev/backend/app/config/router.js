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

router.match('/api/quest', 'GET').to('Quest.list');
router.match('/api/quest/:id', 'GET').to('Quest.one');
router.match('/api/quest/edit/:id', 'POST').to('Quest.update');
router.match('/api/quest/create', 'POST').to('Quest.create');
router.match('/api/quest/delete/:id', 'GET').to('Quest.destroy');

router.match('/api/newsnav', 'GET').to('Newsnav.list');
router.match('/api/newsnav/:id', 'GET').to('Newsnav.one');
router.match('/api/newsnav/create', 'POST').to('Newsnav.create');
router.match('/api/newsnav/delete/:id', 'GET').to('Newsnav.destroy');

router.match('/api/questnav', 'GET').to('Questnav.list');
router.match('/api/questnav/:id', 'GET').to('Questnav.one');
router.match('/api/questnav/create', 'POST').to('Questnav.create');
router.match('/api/questnav/delete/:id', 'GET').to('Questnav.destroy');

router.match('/api/event', 'GET').to('Event.list');
router.match('/api/event/create', 'POST').to('Event.create');
router.match('/api/event/delete/:id', 'GET').to('Event.destroy');

router.match('/api/hall', 'GET').to('Hall.list');
router.match('/api/hall/create', 'POST').to('Hall.create');
router.match('/api/hall/delete/:id', 'GET').to('Hall.destroy');

router.match('/api/doc', 'GET').to('Doc.list');
router.match('/api/doc/create', 'POST').to('Doc.create');
router.match('/api/doc/update/:id', 'POST').to('Doc.update');
router.match('/api/doc/update2/:id', 'POST').to('Doc.update2');
router.match('/api/doc/delete/:id', 'GET').to('Doc.destroy');

router.match('/api/docnode', 'GET').to('Docnode.list');
router.match('/api/docnode/create', 'POST').to('Docnode.create');
router.match('/api/docnode/delete/:id', 'GET').to('Docnode.destroy');

router.match('/api/structure', 'GET').to('Struct.list');
router.match('/api/structure/create', 'POST').to('Struct.create');
router.match('/api/structure/delete/:id', 'GET').to('Struct.destroy');

router.match('/api/newspaper', 'GET').to('Newspaper.list');
router.match('/api/newspaper/create', 'POST').to('Newspaper.create');
router.match('/api/newspaper/delete/:id', 'GET').to('Newspaper.destroy');

router.match('/api/auth/login', 'POST').to('Auth.authenticate');
router.match('/api/auth/client/login', 'POST').to('Auth.authenticateClient');
router.match('/api/auth/status', 'GET').to('Auth.status');
router.match('/api/auth/client/status', 'GET').to('Auth.statusClient');
router.match('/api/auth/logout', 'GET').to('Auth.logout');
router.match('/api/auth/client/logout', 'GET').to('Auth.logoutClient');

router.match('/api/sdi/groups', 'GET').to('Sdi.groups');
router.match('/api/sdi/groups/in', 'POST').to('Sdi.groupsIn');
router.match('/api/sdi/tree', 'POST').to('Sdi.tree');
router.match('/api/sdi/tree2', 'POST').to('Sdi.tree2');
router.match('/api/sdi/content', 'POST').to('Sdi.content');

router.match('/api/user', 'GET').to('Users.list');

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
