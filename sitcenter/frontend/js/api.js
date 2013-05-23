
var ImgCache = {
	options: {
		debug: true,		
		localCacheFolder: 'imgcache',
		useDataURI: false,		
		chromeQuota: 4010*1024*1024,	
		usePersistentCache: true	
	},
	version: '0.5.2',
	ready: false
};

(function($) {

	var old_src_attr = 'data-old-src';

	// with a little help from http://code.google.com/p/js-uri/
	var URI = function(str) {
	    if (!str) str = "";
	    // Based on the regex in RFC2396 Appendix B.
	    var parser = /^(?:([^:\/?\#]+):)?(?:\/\/([^\/?\#]*))?([^?\#]*)(?:\?([^\#]*))?(?:\#(.*))?/;
	    var result = str.match(parser);
	    this.scheme    = result[1] || null;
	    this.authority = result[2] || null;
	    this.path      = result[3] || null;
	    this.query     = result[4] || null;
	    this.fragment  = result[5] || null;
	};

	var is_cordova = function() {
		return (typeof(cordova) !== 'undefined' || typeof(phonegap) !== 'undefined');
	};


	// level: 1=INFO, 2=WARNING, 3=ERROR
	var logging = function(str, level) {
		if (ImgCache.options.debug) {
			if (ImgCache.options.customLogger)
				ImgCache.options.customLogger(str, level);
			else {
				if (level == 1) str = 'INFO: ' + str;
				if (level == 2) str = 'WARN: ' + str;
				if (level == 3) str = 'ERROR: ' + str;
				console.log(str);
			}
		}
	};

	// returns lower cased filename from full URI
	var URIGetFileName = function(fullpath) {
		if (!fullpath)
			return;
		//TODO: there must be a better way here.. (url encoded strings fail)
		var idx = fullpath.lastIndexOf("/");
		if (!idx)
			return;
		return fullpath.substr(idx + 1).toLowerCase();
	};

	// returns lower cased path from full URI
	var URIGetPath = function(str) {
		if (!str)
			return;
		var uri = URI(str);
		return uri.path.toLowerCase();
	};

	// returns extension from filename (without leading '.')
	var FileGetExtension = function(filename) {
		if (!filename)
			return '';
		filename = filename.split('?')[0];
		var ext = filename.split('.').pop();
		// make sure it's a realistic file extension - for images no more than 4 characters long (.jpeg)
		if (!ext || ext.length > 4)
			return '';
		return ext;
	};

	function SHA1(s){function U(a,b,c){while(0<c--)a.push(b)}function L(a,b){return(a<<b)|(a>>>(32-b))}function P(a,b,c){return a^b^c}function A(a,b){var c=(b&0xFFFF)+(a&0xFFFF),d=(b>>>16)+(a>>>16)+(c>>>16);return((d&0xFFFF)<<16)|(c&0xFFFF)}var B="0123456789abcdef";return(function(a){var c=[],d=a.length*4,e;for(var i=0;i<d;i++){e=a[i>>2]>>((3-(i%4))*8);c.push(B.charAt((e>>4)&0xF)+B.charAt(e&0xF))}return c.join('')}((function(a,b){var c,d,e,f,g,h=a.length,v=0x67452301,w=0xefcdab89,x=0x98badcfe,y=0x10325476,z=0xc3d2e1f0,M=[];U(M,0x5a827999,20);U(M,0x6ed9eba1,20);U(M,0x8f1bbcdc,20);U(M,0xca62c1d6,20);a[b>>5]|=0x80<<(24-(b%32));a[(((b+65)>>9)<<4)+15]=b;for(var i=0;i<h;i+=16){c=v;d=w;e=x;f=y;g=z;for(var j=0,O=[];j<80;j++){O[j]=j<16?a[j+i]:L(O[j-3]^O[j-8]^O[j-14]^O[j-16],1);var k=(function(a,b,c,d,e){var f=(e&0xFFFF)+(a&0xFFFF)+(b&0xFFFF)+(c&0xFFFF)+(d&0xFFFF),g=(e>>>16)+(a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(f>>>16);return((g&0xFFFF)<<16)|(f&0xFFFF)})(j<20?(function(t,a,b){return(t&a)^(~t&b)}(d,e,f)):j<40?P(d,e,f):j<60?(function(t,a,b){return(t&a)^(t&b)^(a&b)}(d,e,f)):P(d,e,f),g,M[j],O[j],L(c,5));g=f;f=e;e=L(d,30);d=c;c=k}v=A(v,c);w=A(w,d);x=A(x,e);y=A(y,f);z=A(z,g)}return[v,w,x,y,z]}((function(t){var a=[],b=255,c=t.length*8;for(var i=0;i<c;i+=8){a[i>>5]|=(t.charCodeAt(i/8)&b)<<(24-(i%32))}return a}(s)).slice(),s.length*8))))}


	// if no local_root set, set relative path
	var _getCachedFilePath = function(img_src, local_root) {
		var hash = SHA1(img_src); 
		var ext = FileGetExtension(URIGetFileName(img_src));
		var filename = hash + (ext ? ('.' + ext) : '');
		return (local_root ? local_root + '/' : '') + filename;
	};

	var _setNewImgPath = function($img, new_src, old_src) {
		$img.attr('src', new_src);
		// store previous url in case we need to reload it
		$img.attr(old_src_attr, old_src);
	};

	var _createCacheDir = function(callback) {
		if (!ImgCache.filesystem)
			return;

		var _fail = function(error) {
			logging('Failed to get/create local cache directory: ' + error.code, 3);
		};
		var _getDirSuccess = function(dirEntry) {
			ImgCache.dirEntry = dirEntry;
			logging('Local cache folder opened: ' + dirEntry.fullPath, 1);

            //Put .nomedia file in cache directory so Android doesn't index it.
            if (is_cordova() && device.platform && device.platform.indexOf('Android') == 0) {
    
                function androidNoMediaFileCreated(entry) {
                    logging('.nomedia file created.');
                    if (callback) callback();
                }
    
                dirEntry.getFile(".nomedia", {create: true, exclusive: false}, androidNoMediaFileCreated, _fail);
            }
            else
            {
                if (callback) callback();
            }

            ImgCache.ready = true;
            $(document).trigger('ImgCacheReady');            
			
		};
		ImgCache.filesystem.root.getDirectory(ImgCache.options.localCacheFolder, {create: true, exclusive: false}, _getDirSuccess, _fail);	
	};

	// This is a wrapper for phonegap's FileTransfer object in order to implement the same feature
	// in Chrome (and possibly extra browsers in the future)
	var FileTransferWrapper = function(filesystem) {
		if (is_cordova()) {
			// PHONEGAP
			this.fileTransfer = new FileTransfer();
		}
		this.filesystem = filesystem;	// only useful for CHROME
	};
	FileTransferWrapper.prototype.download = function(uri, localPath, success_callback, error_callback) {
		// PHONEGAP
		if (this.fileTransfer) return this.fileTransfer.download(uri, localPath, success_callback, error_callback);

		var filesystem = this.filesystem;

		// CHROME - browsers
		var _fail = function( str, level, error_callback ) {
			logging(str, level);
			// mock up FileTransferError, so at least caller knows there was a problem.
			// Normally, the error.code in the callback is a FileWriter error, we return 0 if the error was an XHR error
			if (error_callback) { 
				error_callback({code: 0, source: uri, target: localPath});
			}
		}
		var xhr = new XMLHttpRequest();
		xhr.open('GET', uri, true);
		xhr.responseType = 'blob';
		xhr.onload = function(event){
			if (xhr.response && (xhr.status == 200 || xhr.status == 0)) {
				filesystem.root.getFile(localPath, { create:true }, function(fileEntry) {
					fileEntry.createWriter(function(writer){

						writer.onerror = error_callback;
						writer.onwriteend = function() { success_callback(fileEntry);  };
						writer.write(xhr.response, error_callback);

					}, error_callback);
				}, error_callback);
			} else {
				_fail('Image ' + uri + ' could not be downloaded - status: ' + xhr.status, 3, error_callback);
			}
		};
		xhr.onerror = function() {
			_fail('XHR error - Image ' + uri + ' could not be downloaded - status: ' + xhr.status, 3, error_callback);
		};
		xhr.send();
	};

	// toURL for html5, toURI for cordova...
	var _getFileEntryURL = function(entry) {
		return entry.toURL ? entry.toURL() : entry.toURI();
	}

	ImgCache.init = function(success_callback, error_callback) {
		ImgCache.init_callback = success_callback;

		var _gotFS = function(filesystem) {
			logging('LocalFileSystem opened', 1);

			// store filesystem handle
			ImgCache.filesystem = filesystem;

			_createCacheDir(ImgCache.init_callback);
		};
		var _fail = function(error) {
			logging('Failed to initialise LocalFileSystem ' + error.code, 3);
			if (error_callback) error_callback();
		};
		if (is_cordova()) {
			// PHONEGAP
			var persistence = (ImgCache.options.usePersistentCache ? LocalFileSystem.PERSISTENT : LocalFileSystem.TEMPORARY);
			window.requestFileSystem(persistence, 0, _gotFS, _fail);
		} else {
			//CHROME
			window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
			window.storageInfo = window.storageInfo || window.webkitStorageInfo;
			if (!window.storageInfo) {
				logging('Your browser does not support the html5 File API', 2);
				if (error_callback) error_callback();
				return;
			}
			// request space for storage
			var quota_size = ImgCache.options.chromeQuota;
			var persistence = (ImgCache.options.usePersistentCache ? window.storageInfo.PERSISTENT : window.storageInfo.TEMPORARY);
			window.storageInfo.requestQuota(
				persistence, 
				quota_size,
				function() { window.requestFileSystem(persistence, quota_size, _gotFS, _fail);  },
				function(error) {  logging('Failed to request quota: ' + error.code, 3); if (error_callback) error_callback(); }
			);
		}
	};

	// this function will not check if image cached or not => will overwrite existing data
	ImgCache.cacheFile = function(img_src, success_callback, fail_callback) {

		if (!ImgCache.filesystem || !ImgCache.dirEntry || !img_src)
			return;

		var filePath = _getCachedFilePath(img_src, ImgCache.dirEntry.fullPath);

		var fileTransfer = new FileTransferWrapper(ImgCache.filesystem);
		fileTransfer.download(
			img_src,
			filePath,
			function(entry) {
				logging('Download complete: ' + entry.fullPath, 1);

				// iOS: the file should not be backed up in iCloud
				// new from cordova 1.8 only
				if (entry.setMetadata) {
				entry.setMetadata(
					function() {
						logging('com.apple.MobileBackup metadata set', 1);
					},
					function() {
						logging('com.apple.MobileBackup metadata could not be set', 2);
					},
					{ "com.apple.MobileBackup": 1 }
					// 1=NO backup oddly enough..
				);
				}

				if (success_callback) success_callback(entry);
			},
			function(error) {
				if (error.source) logging('Download error source: ' + error.source, 3);
				if (error.target) logging('Download error target: ' + error.target, 3);
				logging('Download error code: ' + error.code, 3);
				if (fail_callback) fail_callback();
			}
		);
	};

	// checks if a copy of the file has already been cached
	// Reminder: this is an asynchronous method!
	// Answer to the question comes in response_callback as the second argument (first being the path)
	ImgCache.isCached = function(img_src, response_callback) {
		// sanity check
		if (!ImgCache.filesystem || !ImgCache.dirEntry || !response_callback)
			return;

		var path = _getCachedFilePath(img_src, ImgCache.dirEntry.fullPath);
		
		if (is_cordova() && device.platform && device.platform.indexOf('Android') == 0 && path.indexOf('file://') == 0) {
			// issue #4 -- android cordova specific
			path = path.substr(7);
		}
		var ret = function(exists, entry) {
			response_callback(img_src, exists, entry);
		};
		// try to get the file entry: if it fails, there's no such file in the cache
		ImgCache.filesystem.root.getFile(
			path,
			{ create: false },
			function(file) { ret(true, file); },
			function() { ret(false); });
	};

	// $img: jQuery object of an <img/> element
	// Synchronous method
	ImgCache.useOnlineFile = function($img) {
		if (!$img)
			return;

		var prev_src = $img.attr(old_src_attr);
		if (prev_src)
			$img.attr('src', prev_src);
		$img.removeAttr(old_src_attr);
	};

	// $img: jQuery object of an <img/> element
	ImgCache.useCachedFileName = function(fileName, success_callback, fail_callback) {

		if (!ImgCache.filesystem || !ImgCache.dirEntry || !fileName)
			return;

		var img_src = fileName;
		var filename = URIGetFileName(img_src);
		var filePath = _getCachedFilePath(img_src, ImgCache.dirEntry.fullPath); // we need only a relative path
		
		var _gotFileEntry = function(entry) {
			if (ImgCache.options.useDataURI) {
				var _win = function(file) {
					var reader = new FileReader();
					reader.onloadend = function(e) {
						var base64content = e.target.result;
						if (!base64content) {
							logging('File in cache ' + filename + ' is empty', 2);
							if (fail_callback) fail_callback($img);
							return;
						}
						_setNewImgPath($img, base64content, img_src);
						logging('File ' + filename + ' loaded from cache', 1);
						if (success_callback) success_callback($img);
					};
					reader.readAsDataURL(file);
				};
				var _fail = function(error) {
					logging('Failed to read file ' + error.code, 3);
					if (fail_callback) fail_callback($img);
				};

				entry.file(_win, _fail);
			} else {
				// using src="filesystem:" kind of url
				var new_url = _getFileEntryURL(entry);
				_setNewImgPath($img, new_url, img_src);
				logging('File ' + filename + ' loaded from cache', 1);
				if (success_callback) success_callback($img);
			}
		};
		// if file does not exist in cache, cache it now!
		var _fail = function(e) {
			console.log(e);
			logging('File ' + filename + ' not in cache', 1);
			if (fail_callback) fail_callback($img);
		};
		var path = _getCachedFilePath(img_src, ImgCache.dirEntry.fullPath);
		ImgCache.filesystem.root.getFile(
			path,
			{ create: false },
			_gotFileEntry,
			_fail);
	}

	// clears the cache
	ImgCache.clearCache = function(success_callback, error_callback) {
		if (!ImgCache.filesystem || !ImgCache.dirEntry) {
			logging('ImgCache not loaded yet!', 2);
			return;
		}

		// delete cache dir completely
		ImgCache.dirEntry.removeRecursively(
			function(parent) {
				logging('Local cache cleared', 1);
				// recreate the cache dir now
				_createCacheDir(success_callback);
			},
			function(error) { 
				logging('Failed to remove directory or its contents: ' + error.code, 3);
				if (error_callback) error_callback();
			}
		);
	};

        // $img: jQuery object of an <div/> element
    ImgCache.useCachedBackground = function($div, success_callback, fail_callback) {

        if (!ImgCache.filesystem || !ImgCache.dirEntry || !$div)
            return;

        var regexp = /\((.+)\)/
        var img_src = regexp.exec($div.css('background-image'))[1];
        var filename = URIGetFileName(img_src);
        var filePath = _getCachedFilePath(img_src); // we need only a relative path

        var _gotFileEntry = function(entry) {
            if (ImgCache.options.useDataURI) {
                var _win = function(file) {
                    var reader = new FileReader();
                    reader.onloadend = function(e) {
                        var base64content = e.target.result;
                        if (!base64content) {
                            logging('File in cache ' + filename + ' is empty', 2);
                            if (fail_callback) fail_callback($div);
                            return;
                        }
                        _setNewImgPath($img, base64content, img_src);
                        logging('File ' + filename + ' loaded from cache', 1);
                        if (success_callback) success_callback($div);
                    };
                    reader.readAsDataURL(file);
                };
                var _fail = function(error) {
                    logging('Failed to read file ' + error.code, 3);
                    if (fail_callback) fail_callback($div);
                };

                entry.file(_win, _fail);
            } else {
                // using src="filesystem:" kind of url
                var new_url = _getFileEntryURL(entry);
                $div.css('background-image', 'url(' + new_url + ')');
                //_setNewImgPath($img, new_url, img_src);
                logging('File ' + filename + ' loaded from cache', 1);
                if (success_callback) success_callback($div);
            }
        };
        // if file does not exist in cache, cache it now!
        var _fail = function(e) {
            logging('File ' + filename + ' not in cache', 1);
            if (fail_callback) fail_callback($div);
        };
        ImgCache.dirEntry.getFile(filePath, { create: false }, _gotFileEntry, _fail);
    }

	// returns the URI of the local cache folder (filesystem:)
	// this function is more useful for the examples than for anything else..
	// Synchronous method
	ImgCache.getCacheFolderURI = function() {
		if (!ImgCache.filesystem || !ImgCache.dirEntry) {
			logging('ImgCache not loaded yet!', 2);
			return;
		}

		return _getFileEntryURL(ImgCache.dirEntry);
	};
})(window.jQuery || window.Zepto);

/**
 * [GraphParametrsWidgets description]
 * @param {[type]} app [description]
 */
var GraphParamsSelector = function(app) {
	this.app = app;
	this.CSS = {
		"MAIN": "#graph-selector",
		"HIDDEN": "hidden",
		"SHOW": "#graph-nav-show",
		"DATA": "#graph-data",
		"DATA-HIDDEN": "#graph-data-hidden",
		"DATA-PLACE": "#graph-data-place",
		"LOAD": "#load"
	};

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"SHOW": $(this.CSS["SHOW"]),
		"DATA": $(this.CSS["DATA"]),
		"DATA-HIDDEN": $(this.CSS["DATA-HIDDEN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"]),
		"FILTER":  $(this.CSS["DATA"]).find("input")
	}

	this.isDataShow = false;
	this.parametrs = {};
	this.scrollApi = null;

	this.initScroll_ = function() {
		$(this.CSS["DATA-PLACE"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["DATA-PLACE"].data('jsp');
	}

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShowClick_, this));
		this.elements["DATA-HIDDEN"].on("click", $.proxy(this.onHiddenClick_, this));

		$(this.CSS["DATA-PLACE"]).on("click", ".graph-params-checkbox" , $.proxy(this.onParamClick_, this));
		$(this.CSS["DATA-PLACE"]).on("click", ".graph-params-name", $.proxy(this.onParamNameClick_, this));

		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));
	}

	this.onShowClick_ = function(evt) {
		this.isDataShow = true;
		this.elements["DATA"].removeClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].addClass(this.CSS["HIDDEN"]);
	}

	this.onHiddenClick_ = function(evt) {
		this.isDataShow = false;
		this.elements["DATA"].addClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].removeClass(this.CSS["HIDDEN"]);
	}

	this.onParamsGet_ = function(data) {
		this.parametrs = this.prepareParamerts_(data);
		this.drawParamets_(this.parametrs);

		this.app.formatWidget.updateContent();
	}

	this.updateParams = function(ids, age) {
		this.app.paramsManager.getParamsByRegionAndAge(
			ids,
			age,
			$.proxy(this.onParamsGet_, this)
		);
	}

	this.drawParamets_ = function(params) {
		if(!this.scrollApi) {
			this.initScroll_();
		}
		var html = "";
		var self = this;
		var contentPane = this.scrollApi.getContentPane();

		$.each(params, function(key, value) {
			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["DATA-PLACE"]);
			if(elementCurrentGroup.size() == 0) {
				var html =  "<ul data-id='"+value.id+"' class='first'><li class='first-li'>";
					html += "<span class='group graph-params-name graph-params-checkbox'>"+value.name+"</span><a href='#' class='graph-params-checkbox current'></a>";
					html += "<ul></ul></li></ul>";

				contentPane.append(html);
			}

			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["DATA-PLACE"]);

			if(value.parameters.length > 0) {
				$.each(value.parameters, function(key2, value2) {
					var paramCurrent = $("li[data-id='"+value2.id+"']", self.CSS["DATA-PLACE"]);
					if(paramCurrent.size() == 0) {
						var html = "<li data-name='"+value2.name+"' data-id='"+value2.id+"'><span  class='param params-name '><em class='spr'>-</em> <em class='name'>"+value2.name+"</em></span><a class='params-checkbox current' href='#'></a></li>";

						elementCurrentGroup.find("ul").append(html);
					} else {
						paramCurrent.find("i").html(value2.value);
					}
				});	
			}
		});
		this.scrollApi.reinitialise();
	}

	this.prepareParamerts_ = function(data) {
		var ret = {};

		$.each(data, function(key, value) {
			if(!ret[value.group_id]) {
				ret[value.group_id] = {
					id: value.group_id,
					name: value.group_name,
					parameters: []
				}
			}
			ret[value.group_id].parameters.push({
				id: value.id,
				name: value.name,
				value: value.param_val
			});
		});

		return ret;
	}

	this.onParamClick_ = function(evt) {
		var current = $(evt.target);
		var parent = $(evt.target).parent();

		$(evt.target).toggleClass("current");

		if(current.hasClass("current")) {
			parent.find("ul a").addClass("current");
		} else {
			parent.find("ul a").removeClass("current");
		}

		$(this.CSS["LOAD"]).addClass("onShow");
		this.app.formatWidget.updateContent();
	}

	this.onParamNameClick_ = function(evt) {
		$(evt.target).parent().find("ul").slideToggle("slow");
	}

	this.getCurrentIds = function() {
		var currentsA = $(this.elements["DATA-PLACE"]).find("li a.current");
		var ids = [];

		$.each(currentsA, function(key, value) {
			ids.push($(value).parent().attr("data-id"));
		});

		return ids;
	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();

		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);	
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["DATA-PLACE"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["DATA-PLACE"]).find("ul li ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});

		/*
		var elems = $(this.CSS["DATA-PLACE"]).find("li");
		$.each(elems, function(key, value) {
			if($(value).find("li:not(.hidde)").size() == 0) {
				$(value).addClass("hidde");
			}
		})
		*/
	}

	this.initScroll_();
	this.bindEvents_();
	this.app.ageSelectorFormatWidget.draw();
	
}

/**
 * [ParametrsWidgets description]
 * @param {[type]} app [description]
 */
var RegionsParametrsWidgets = function(app) {
	this.app =  app;
	this.parametrs = {};
	this.currentParametr = null;
	this.CSS = {
		"SHOW": "#regions-paramers-show",
		"MAIN": "#regions-parametrs-widget",
		"SCROLL": ".scroll",
		"HIDDEN": "#regions-parametrs-widget > .hidden",
		"PARAMETRS-LIST": "#regions-parametrs-list",
		"TITLE": "#regions-parametrs-widget h3",
		"FILTER": "#regions-params-filter",
		"AGE-SELECT": "#regions_age_select",
		"UOM": "#regions-param-info",
		"MAP-PARAMS": "#regions-params"
	}

	this.elements = {
		"SHOW": $(this.CSS["SHOW"]),
		"MAIN": $(this.CSS["MAIN"]),
		"SCROLL": $(this.CSS["SCROLL"]),
		"HIDDEN": $(this.CSS["HIDDEN"]),
		"PARAMETRS-LIST": $(this.CSS["PARAMETRS-LIST"]),
		"TITLE": $(this.CSS["TITLE"]),
		"FILTER": $(this.CSS["FILTER"]),
		"AGE-SELECT": $(this.CSS["AGE-SELECT"]),
		"UOM": $(this.CSS["UOM"]),
		"MAP-PARAMS": $(this.CSS["MAP-PARAMS"])
	}

	this.animateStep = "-350px";
	this.animateSpeed = 1000;
	this.legendWidget = new RegionsLegendWidget(this.app);
	this.scrollApi = null;

	this.fullHidden = function() {
		this.elements["MAP-PARAMS"].addClass("hidden");
	}

	this.fullShow = function() {
		this.elements["MAP-PARAMS"].removeClass("hidden");
	}

	this.parametrsClick_ = function(evt) {
		$(evt.target).parent().find("ul").slideToggle("slow");
	}

	this.getParametrById = function(id) {
		var par = null;

		$.each(this.parametrs, function(key, value) {
			if(value && value.id == id) {
				par = value;
			}
		});

		return par;
	}

	this.parametrsNameClick_ = function(evt) {
		if(!$(evt.target).hasClass("active")) {
			var self = this;
			var parentLi = $(evt.target).parent().parent();
			$(this.CSS["SCROLL"]).find(".active").removeClass("active");
			$(evt.target).toggleClass("active");
			
			this.setTitle($(evt.target).html());
			this.currentParametr = this.getParametrById(parentLi.attr("data-id"));
			this.app.regionsMapColorel.colored(
				this.currentParametr.id, 
				this.app.ageSelectorRegionsWidget.selectedAge
			);
			this.app.regionsMapColorWidget.updateParams();
			this.elements["UOM"].html(parentLi.attr("data-uom"));
			//self.legendWidget.show();
		} else {
			/*$(this.CSS["PARAMETRS-LIST"]).find(".active").removeClass("active");
			this.setTitle("");
			this.currentParametr = null;
			this.elements["UOM"].html("");
			this.app.regionsMapColorWidget.onToggle_();
			this.app.regionsLegendWidget.hide();
			this.app.regionsMapColorel.hidden();*/
		}
	}

	this.setTitle = function(title) {
		this.elements["TITLE"].html(title);
	}

	this.prepareParamerts_ = function(data) {
		var ret = {};

		$.each(data, function(key, value) {
			if(!ret[value.group_id]) {
				ret[value.group_id] = {
					id: value.group_id,
					name: value.group_name,
					parameters: []
				}
			}
			
			ret[value.group_id].parameters.push({
				id: value.param_id,
				name: value.param_name,
				value: value.param_val
			});
		});

		return ret;
	}

	this.getParametrs_ = function(data) {
		var self = this;
		this.parametrs = data;
		this.drawRegionsParamets_(this.parametrs);

		$(this.CSS["PARAMETRS-LIST"]+" .name").on("click", $.proxy(this.parametrsNameClick_, this));

		if(this.currentParametr) {
			this.app.legendManager.getLegendByParamAndSubject(
				this.currentParametr.id, 
				this.app.currentRegion,
				function(data) {
					self.legendWidget.setLevelText(data);
					self.legendWidget.show();
				}
			);	
		}
		
	}

	this.initScroll_ = function() {
		$(this.CSS["PARAMETRS-LIST"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["PARAMETRS-LIST"].data('jsp');
	}

	this.drawRegionsParamets_ = function(params) {
		var html = "";
		var self = this;
		var contentPane = this.scrollApi.getContentPane();
		var html =  "<ul class='first regions-params'>"
		$.each(params, function(key, value) {
			var uom = value.uom_name == null ? "" : value.uom_name;
			html += "<li data-uom='"+uom+"' data-name='"+value.name+"' data-id='"+value.id+"'><span  class='param'><em class='spr'>-</em> <em class='name'>"+value.name+"</em></span></li>";
		});
		html += "</ul>";
		contentPane.append(html);

		this.scrollApi.reinitialise();
	}

	this.onHidden_ = function() {
		this.elements["MAIN"].animate( {
				right: this.animateStep
			},
			this.animateSpeed,
			$.proxy(this.onMainHiddened_, this) 
		);
		this.elements["SHOW"].animate({
				right: "0px"
			},
			this.animateSpeed/4,
			$.proxy(this.onMainHiddened_, this) 
		);
		this.legendWidget.hide();
		return false;
	}

	this.onShow_ = function() {
		//this.elements["SHOW"].addClass("onRight");
		this.elements["SHOW"].animate({
				right: this.animateStep
			},
			this.animateSpeed/2,
			$.proxy(this.onMainShowed_, this) 
		);
		
		return false;
	}

	this.onMainShowed_ = function() {
		this.elements["MAIN"].css({
			right: this.animateStep,
			display: "block"
		});
		
		this.elements["MAIN"].animate({
				right: "0px"
			},
			this.animateSpeed
		);

		if(this.currentParametr != null) {
			//this.legendWidget.show();
		}
		this.initScroll_();
	}

	this.onMainHiddened_ = function() {
		
	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();
		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);	
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["PARAMETRS-LIST"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["PARAMETRS-LIST"]).find("ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});
		
	}

	this.getParamsByRegionAndYeage = function(region_id) {
		this.app.paramsManager.getParamsByRegionAndYeage(
			region_id, 
			this.app.ageSelectorRegionsWidget.selectedAge, 
			$.proxy(this.getParametrs_, this)
		);
	}

	this.getRegionsParams = function() {
		this.app.paramsManager.getRegionsParams($.proxy(this.getParametrs_, this));
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShow_, this));
		this.elements["HIDDEN"].on("click", $.proxy(this.onHidden_, this));
		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));
	}

	this.initScroll_();
	this.bindEvents_();
	this.app.ageSelectorRegionsWidget.draw();
}

/**
 * [ParametrsWidgets description]
 * @param {[type]} app [description]
 */
var ParametrsWidgets = function(app) {
	this.app =  app;
	this.parametrs = {};
	this.currentParametr = null;
	this.CSS = {
		"SHOW": "#paramers-show",
		"MAIN": "#parametrs-widget",
		"SCROLL": ".scroll",
		"HIDDEN": ".hidden",
		"PARAMETRS-LIST": "#parametrs-list",
		"TITLE": "#parametrs-widget h3",
		"FILTER": "#params-filter",
		"AGE-SELECT": "#age_select",
		"UOM": "#param-info",
		"MAP-PARAMS": "#map-params"
	}

	this.elements = {
		"SHOW": $(this.CSS["SHOW"]),
		"MAIN": $(this.CSS["MAIN"]),
		"SCROLL": $(this.CSS["SCROLL"]),
		"HIDDEN": $(this.CSS["HIDDEN"]),
		"PARAMETRS-LIST": $(this.CSS["PARAMETRS-LIST"]),
		"TITLE": $(this.CSS["TITLE"]),
		"FILTER": $(this.CSS["FILTER"]),
		"AGE-SELECT": $(this.CSS["AGE-SELECT"]),
		"UOM": $(this.CSS["UOM"]),
		"MAP-PARAMS": $(this.CSS["MAP-PARAMS"])
	}

	this.animateStep = "-350px";
	this.animateSpeed = 1000;
	this.legendWidget = new LegendWidget(this.app);
	this.scrollApi = null;

	this.fullHidden = function() {
		this.elements["MAP-PARAMS"].addClass("hidden");
	}

	this.fullShow = function() {
		this.elements["MAP-PARAMS"].removeClass("hidden");
	}

	this.parametrsClick_ = function(evt) {
		$(evt.target).parent().find("ul").slideToggle("slow");
	}

	this.getParametrById = function(id) {
		var par = null;

		$.each(this.parametrs, function(key, value) {
			$.each(value.parameters, function(key2, value2) {
				if(value2 && value2.id == id) {
					par = value2;
				}
			});
		});

		return par;
	}

	this.parametrsNameClick_ = function(evt) {
		if(!$(evt.target).hasClass("active")) {
			var self = this;
			var parentLi = $(evt.target).parent().parent();
			$(this.CSS["PARAMETRS-LIST"]).find(".active").removeClass("active");
			$(evt.target).toggleClass("active");

			this.setTitle($(evt.target).html());
			this.currentParametr = this.getParametrById(parentLi.attr("data-id"));
			this.app.mapColorel.colored(
				this.currentParametr.id, 
				this.app.currentRegion, 
				this.app.ageSelectorWidget.selectedAge
			);
			this.app.mapColorWidget.updateParams();
			this.app.paramsManager.getParamUom(this.currentParametr.id, function(data) {
				if(data && data.responseText) {
					self.elements["UOM"].html(data.responseText);
				} else {
					self.elements["UOM"].html("");
				}
			});
			this.app.legendManager.getLegendByParamAndSubject(
				this.currentParametr.id, 
				this.app.currentRegion,
				function(data) {
					//self.legendWidget.setLevelText(data);
					//self.legendWidget.show();
				}
			);
		} else {
			/*$(this.CSS["PARAMETRS-LIST"]).find(".active").removeClass("active");
			this.setTitle("");
			this.currentParametr = null;
			this.elements["UOM"].html("");
			this.app.mapColorWidget.onToggle_();
			this.legendWidget.hide();
			this.app.mapColorel.hidden();*/
		}
	}

	this.setTitle = function(title) {
		this.elements["TITLE"].html(title);
	}

	this.prepareParamerts_ = function(data) {
		var ret = {};

		$.each(data, function(key, value) {
			if(!ret[value.group_id]) {
				ret[value.group_id] = {
					id: value.group_id,
					name: value.group_name,
					parameters: []
				}
			}
						
			ret[value.group_id].parameters.push({
				id: value.param_id,
				name: value.param_name,
				value: value.param_val
			});
		});

		return ret;
	}

	this.getParametrs_ = function(data) {
		var self = this;
		this.parametrs = this.prepareParamerts_(data);
		this.drawParamets_(this.parametrs);

		if(this.currentParametr) {
			this.app.legendManager.getLegendByParamAndSubject(
				this.currentParametr.id, 
				this.app.currentRegion,
				function(data) {
					//self.legendWidget.setLevelText(data);
					//self.legendWidget.show();
				}
			);	
		}
		
	}

	this.initScroll_ = function() {
		$(this.CSS["PARAMETRS-LIST"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["PARAMETRS-LIST"].data('jsp');
	}

	this.drawParamets_ = function(params) {
		var html = "";
		var self = this;
		var contentPane = this.scrollApi.getContentPane();

		$.each(params, function(key, value) {
			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["PARAMETRS-LIST"]);
			if(elementCurrentGroup.size() == 0) {
				var html =  "<ul data-id='"+value.id+"' class='first'><li class='first-li'>";
					html += "<a class='group'>"+value.name+"</a>";
					html += "<ul></ul></li></ul>";

				contentPane.append(html);
			}

			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["PARAMETRS-LIST"]);

			if(value.parameters.length > 0) {
				$.each(value.parameters, function(key2, value2) {
					var paramCurrent = $("li[data-id='"+value2.id+"']", self.CSS["PARAMETRS-LIST"]);
					if(value2.value == null) {
						value2.value = "";
					}
					if(paramCurrent.size() == 0) {
						var html = "<li data-name='"+value2.name+"' data-id='"+value2.id+"'><span  class='param'><em class='spr'>-</em> <em class='name'>"+value2.name+"</em></span><i>"+value2.value+"</i></li>";

						elementCurrentGroup.find("ul").append(html);
					} else {
						paramCurrent.find("i").html(value2.value);
					}
				});	
			}
		});
		this.scrollApi.reinitialise();
	}

	this.onHidden_ = function() {
		this.elements["MAIN"].animate( {
				right: this.animateStep
			},
			this.animateSpeed,
			$.proxy(this.onMainHiddened_, this) 
		);
		this.elements["SHOW"].animate({
				right: "0px"
			},
			this.animateSpeed/4,
			$.proxy(this.onMainHiddened_, this) 
		);
		this.legendWidget.hide();
		return false;
	}

	this.onShow_ = function() {
		//this.elements["SHOW"].addClass("onRight");
		this.elements["SHOW"].animate({
				right: this.animateStep
			},
			this.animateSpeed/2,
			$.proxy(this.onMainShowed_, this) 
		);
		
		return false;
	}

	this.onMainShowed_ = function() {
		this.elements["MAIN"].css({
			right: this.animateStep,
			display: "block"
		});
		
		this.elements["MAIN"].animate({
				right: "0px"
			},
			this.animateSpeed
		);

		if(this.currentParametr != null) {
			//this.legendWidget.show();
		}
		this.initScroll_();
	}

	this.onMainHiddened_ = function() {
		
	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();
		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);	
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["PARAMETRS-LIST"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["PARAMETRS-LIST"]).find("ul li ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});

		var elems = $(this.CSS["PARAMETRS-LIST"]).find("ul");
		$.each(elems, function(key, value) {
			if($(value).find("li ul li:not(.hidde)").size() == 0) {
				$(value).addClass("hidde");
			}
		})
		
	}

	this.getParamsByRegionAndYeage = function(region_id) {
		this.app.paramsManager.getParamsByRegionAndYeage(
			region_id, 
			this.app.ageSelectorWidget.selectedAge, 
			$.proxy(this.getParametrs_, this)
		);
	}

	this.getRegionsParams = function() {
		this.app.paramsManager.getRegionsParams($.proxy(this.getParametrs_, this));
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShow_, this));
		this.elements["HIDDEN"].on("click", $.proxy(this.onHidden_, this));
		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));

		$("body").on("click", this.CSS["PARAMETRS-LIST"]+" li.first-li", $.proxy(this.parametrsClick_, this));
		$("body").on("click", this.CSS["PARAMETRS-LIST"]+" .name", $.proxy(this.parametrsNameClick_, this));
	}

	this.initScroll_();
	this.bindEvents_();
	this.app.ageSelectorWidget.draw();
}

/**
 * [LegendWidget description]
 * @param {[type]} app [description]
 */
var LegendWidget = function(app) {
	this.app =  app;
	this.animateStep = "-400px";
	this.animateSpeed = 1000;
	this.isShow = false;

	

	this.CSS = {
		"MAIN": "#legend-widget"
	}

	this.elements = {
		"MAIN": $(this.CSS["MAIN"])
	}

	$(this.CSS["MAIN"]).find("p:first-child").html("нет<br /> данных");

	this.show = function() {
		if(!this.isShow) {
			this.elements["MAIN"].css({
				right: this.animateStep,
				display: "block"
			});
			this.elements["MAIN"].animate({
					right: "0px"
				},
				this.animateSpeed
			);

			this.isShow = true;
		}
		
	}

	this.setLevelText = function(data) {
		var $p = $(this.CSS["MAIN"]).find("p");
		$.each($p, function(key, value) {
			if(key == 0) {
				$(value).html("нет<br /> данных");
			}
			if(key == 1 && data["red"]) {
				var string = "";
				if(data["red"][0]) {
					string += parseInt(data["red"][0]);
				}
				if(data["red"][1]) {
					if(data["red"][0]) {
						string += "-";
					}
					string += parseInt(data["red"][1]);
				}
			}
			if(key == 2 && data["yellow"]) {
				var string = "";
				if(data["yellow"][0]) {
					string += parseInt(data["yellow"][0]);
				}
				if(data["yellow"][1]) {
					if(data["yellow"][0]) {
						string += "-";
					}
					string += parseInt(data["yellow"][1]);
				}
				$(value).html(string);
			}
			if(key == 3 && data["green"]) {
				var string = "";
				if(data["green"][0]) {
					string += parseInt(data["green"][0]);
				}
				if(data["green"][1]) {
					if(data["green"][0]) {
						string += "-";
					}
					string += parseInt(data["green"][1]);
				}
				$(value).html(string);
			}
		});
	}

	this.hide = function() {
		this.elements["MAIN"].animate( {
				right: this.animateStep
			},
			this.animateSpeed 
		);

		this.isShow = false;
	}
}

/**
 * [LegendWidget description]
 * @param {[type]} app [description]
 */
var RegionsLegendWidget = function(app) {
	this.app =  app;
	this.animateStep = "-400px";
	this.animateSpeed = 1000;
	this.isShow = false;

	this.CSS = {
		"MAIN": "#regions-legend-widget"
	}

	this.elements = {
		"MAIN": $(this.CSS["MAIN"])
	}

	this.show = function() {
		if(!this.isShow) {
			this.elements["MAIN"].css({
				right: this.animateStep,
				display: "block"
			});
			this.elements["MAIN"].animate({
					right: "0px"
				},
				this.animateSpeed
			);

			this.isShow = true;
		}
		
	}

	this.hide = function() {
		this.elements["MAIN"].animate( {
				right: this.animateStep
			},
			this.animateSpeed 
		);

		this.isShow = false;
	}
}

/**
 * [RegionManager description]
 * @param {[type]} app [description]
 */
var RegionManager = function(app) {
	this.app = app;
	this.ajaxPath = "/subjects.json";

	this.getByParent = function(id_parent, callback) {
		$.get(this.app.apiHost + "/subjects/"+id_parent+"/children.json", callback);
	}

	this.getParents = function(id_parent, callback) {
		$.get(this.app.apiHost + "/subjects/"+id_parent+"/parent.json", callback);
	}

	this.getById = function(id, callback) {
		$.get(this.app.apiHost + "/subjects/"+id+".json", callback);
	}

	this.getDistricts = function(callback) {
		$.get(this.app.apiHost + "/districts.json", callback);
	}

	this.getAll = function(callback) {
		$.get(this.app.apiHost + "/subjects.json", callback);
	}
}

/**
 * [LegendManager description]
 * @param {[type]} app [description]
 */
var LegendManager = function(app) {
	this.app = app;
	this.ajaxPath = "/param_levels/";

	this.getLegendByParamAndSubject = function(param_id, subject_id, callback) {
		$.get(this.app.apiHost + this.ajaxPath + param_id + "/" + subject_id, callback);
	}
}


/**
 * [ParamsManager description]
 * @param {[type]} app [description]
 */
var ParamsManager = function(app) {
	this.app = app;
	this.ajaxPath = "/groups/";

	this.getParamsByRegionAndYeage = function(region_id, yeage, callback) {
		$.get(this.app.apiHost + this.ajaxPath + region_id+ "/" + yeage , callback);
	}

	this.getRegionsParams = function(callback) {
		$.get(this.app.apiHost + "/regions_params/", callback);
	}

	this.getRegionStateByParamsAndYeage = function(region_id, yeage, callback) {
		$.get(this.app.apiHost + "/parameters/" + region_id + "/" + yeage , callback);
	}

	this.getParamValues = function(param_id, subject_id, year, callback) {
		$.get(this.app.apiHost + "/param_vals/" + param_id + "/" + subject_id + "/" + year, callback);
	}

	this.getRegionsParamValues = function(param_id, year, callback) {
		$.get(this.app.apiHost + "/param_values/" + param_id + "/" + year, callback);
	}

	this.getParamUom = function(param_id, callback) {
		$.ajax(this.app.apiHost + "/parameter_uom/" + param_id).always(callback);
	}

	this.getMapByParamAndYear = function(param_id, year, callback) {
		$.get(this.app.apiHost + "/param_values/" + param_id + "/" + year, callback);
	}

	this.getParamsByRegionAndAge = function(regions, age, callback) {
		$.ajax(
			{
				url: this.app.apiHost + "/parameter_names/",
				type: "POST",
				dataType: 'JSON',
				data: {
					"subject_ids": regions,
					"year": age
				},
				success: callback
			}
		);
	}
}

/**
 * [FormatManager description]
 * @param {[type]} app [description]
 */
var FormatManager = function(app) {
	this.app = app;

	this.getFormat = function(regions_id, params_id, age, callback) {
		$.ajax(
			{
				url: this.app.apiHost + "/formats/",
				type: "POST",
				dataType: 'JSON',
				data: {
					"subject_ids": regions_id,
					"parameter_ids": params_id,
					"year": age
				},
				success: callback
			}
		);
	}
}

/**
 * [MapColorWidget description]
 * @param {[type]} app [description]
 */
var MapColorWidget = function(app) {
	this.app = app;
	this.state = false;

	this.CSS = {
		"TOGGLE": "#map-color-toggler"
	}

	this.elements = {
		"TOGGLE": $(this.CSS["TOGGLE"])
	}

	this.bindEvents_ = function() {
		this.elements["TOGGLE"].on("click", $.proxy(this.onToggle_, this));
	}

	this.paramsLoaded_ = function(data) {
		var ret = {};
		$.each(data, function(key, value) {
			if(value.val_numeric != 0) {
				ret[value.subject_id] = value.val_numeric;	
			}
		});
		this.app.mapStateManager.SVGWriter.drawParamValues(ret);
	}

	this.updateParams = function() {
		if(this.state && this.app.parametrsWidgets.currentParametr) {
			this.app.paramsManager.getParamValues(
				this.app.parametrsWidgets.currentParametr.id,
				this.app.currentRegion,
				this.app.ageSelectorWidget.selectedAge,
				$.proxy(this.paramsLoaded_, this)
			);
		}
 	}

	this.onToggle_ = function() {
		if(this.state == false) {
			this.elements["TOGGLE"].addClass("onShow");
			this.state = true;

			this.updateParams();
		} else {
			this.elements["TOGGLE"].removeClass("onShow");
			this.state = false;
			this.app.mapStateManager.SVGWriter.removeParamValues();
		}

		return false;
	}

	this.bindEvents_();
}

/**
 * [MapColorWidget description]
 * @param {[type]} app [description]
 */
var MapColorWidget = function(app) {
	this.app = app;
	this.state = false;

	this.CSS = {
		"TOGGLE": "#map-color-toggler"
	}

	this.elements = {
		"TOGGLE": $(this.CSS["TOGGLE"])
	}

	this.bindEvents_ = function() {
		this.elements["TOGGLE"].on("click", $.proxy(this.onToggle_, this));
	}

	this.paramsLoaded_ = function(data) {
		this.app.mapStateManager.SVGWriter.drawParamValues(data);
	}

	this.updateParams = function() {
		if(this.state && this.app.parametrsWidgets.currentParametr) {
			this.app.paramsManager.getParamValues(
				this.app.parametrsWidgets.currentParametr.id,
				this.app.currentRegion,
				this.app.ageSelectorWidget.selectedAge,
				$.proxy(this.paramsLoaded_, this)
			);
		}
 	}

 	this.enable = function() {
 		this.elements["TOGGLE"].addClass("onShow");
		this.state = true;

		this.updateParams();
 	}

 	this.disable = function() {
 		this.elements["TOGGLE"].removeClass("onShow");
		this.state = false;
		this.app.mapStateManager.SVGWriter.removeParamValues();
 	}

	this.onToggle_ = function() {
		if(this.state == false) {
			this.enable();
		} else {
			this.disable();
		}

		return false;
	}

	this.bindEvents_();
}

/**
 * [RegionsMapColorWidget description]
 * @param {[type]} app [description]
 */
var RegionsMapColorWidget = function(app) {
	this.app = app;
	this.state = false;

	this.CSS = {
		"TOGGLE": "#regions-map-color-toggler"
	}

	this.elements = {
		"TOGGLE": $(this.CSS["TOGGLE"])
	}

	this.bindEvents_ = function() {
		this.elements["TOGGLE"].on("click", $.proxy(this.onToggle_, this));
	}

	this.paramsLoaded_ = function(data) {
		var ret = {};
		$.each(data, function(key, value) {
			if(value.val_numeric != 0) {
				ret[value.subject_id] = value.val_numeric;	
			}
		});
		this.app.mapStateManager.SVGWriter.drawParamValues(ret, "regions");
	}

	this.updateParams = function() {
		console.log(this.app.regionsParametrsWidgets.currentParametr);
		if(this.state && this.app.regionsParametrsWidgets.currentParametr) {
			this.app.paramsManager.getRegionsParamValues(
				this.app.regionsParametrsWidgets.currentParametr.id,
				this.app.ageSelectorRegionsWidget.selectedAge,
				$.proxy(this.paramsLoaded_, this)
			);
		}
 	}

 	this.enable = function() {
 		this.elements["TOGGLE"].addClass("onShow");
		this.state = true;

		this.updateParams();
 	}

 	this.disable = function() {
 		this.elements["TOGGLE"].removeClass("onShow");
		this.state = false;
		this.app.mapStateManager.SVGWriter.removeParamValues();
 	}

	this.onToggle_ = function() {
		if(this.state == false) {
			this.enable();
		} else {
			this.disable();
		}

		return false;
	}

	this.bindEvents_();
}

/**
 * [MapColorel description]
 * @param {[type]} app [description]
 */
var MapColorel = function(app) {
	this.app = app;
	this.ajaxPath = "/subjects/";
	this.CSS = {
		"CONTAINER": "#bg-colored-image",
		"LOAD": "#load"
	};
	this.isShowed = false;

	this.elements = {
		"CONTAINER": $(this.CSS["CONTAINER"]),
		"IMAGE": $(this.CSS["CONTAINER"]).find("img")
	}


	this.colored = function(params_id, region_id, year, callback) {
		var self = this;
		var mapPath = this.app.apiHost+this.ajaxPath+params_id+"/"+region_id+"/"+year+"/map";

		//$(this.CSS["LOAD"]).addClass("onShow");

		if(this.isShowed) {
			this.elements["CONTAINER"].removeClass("onShow");
		}
		$.ajax({ url: mapPath }).always(function(data) {
			self.onGetMapLink_(data, callback);
		});
	}

	this.onGetMapLink_ = function(data, callback) {
		var link = data.responseText;
		var self = this;
		var image = new Image();

        image.src = self.app.apiHost+link;

        image.onload = function() {
        	if(callback) {
        		callback();
			}
			setTimeout(function() {
    			self.elements["CONTAINER"].css("backgroundImage", "url('"+self.app.apiHost+link+"')");
				self.elements["CONTAINER"].addClass("onShow");
    		}, 0);
        	
			//$(self.CSS["LOAD"]).removeClass("onShow");
			
        }
	}

	this.show = function() {
		this.elements["CONTAINER"].addClass("onShow");
		this.isShowed = true;
	}

	this.hidden = function() {
		this.elements["CONTAINER"].removeClass("onShow");
		this.isShowed = false;
	}
}

/**
 * [MapColorel description]
 * @param {[type]} app [description]
 */
var RegionsMapColorel = function(app) {
	this.app = app;
	this.ajaxPath = "/param_values/";
	this.CSS = {
		"CONTAINER": "#bg-regions-image",
		"LOAD": "#load"
	};
	this.isShowed = false;

	this.elements = {
		"CONTAINER": $(this.CSS["CONTAINER"]),
		"IMAGE": $(this.CSS["CONTAINER"]).find("img")
	}

	this.getColoredPath = function(params_id, year) {
		var mapPath = "";
		if(this.app.regionPanel.currentCamera == "CENTER") {
			mapPath = this.app.apiHost+this.ajaxPath+params_id+"/"+year+"/map";
		}

		if(this.app.regionPanel.currentCamera == "LEFT") {
			mapPath = this.app.apiHost+this.ajaxPath+params_id+"/"+year+"/map-west";
		}

		if(this.app.regionPanel.currentCamera == "RIGHT") {
			mapPath = this.app.apiHost+this.ajaxPath+params_id+"/"+year+"/map-east";
		}

		return mapPath;
	}


	this.colored = function(params_id, year) {
		//$(this.CSS["LOAD"]).addClass("onShow");

		if(this.isShowed) {
			this.elements["CONTAINER"].removeClass("onShow");
		}
		$.ajax({ url: this.getColoredPath(params_id, year) }).always($.proxy(this.onGetMapLink_, this));
	}

	this.onGetMapLink_ = function(data) {
		var link = data.responseText;
		var self = this;
		var image = new Image();

        image.src = self.app.apiHost+link;

        image.onload = function() {
        	self.app.regionPanel.setBg(self.app.apiHost+link);
			self.elements["CONTAINER"].addClass("onShow");
			//$(self.CSS["LOAD"]).removeClass("onShow");
        }
	}

	this.show = function() {
		this.elements["CONTAINER"].addClass("onShow");
		this.isShowed = true;
	}

	this.hidden = function() {
		this.elements["CONTAINER"].removeClass("onShow");
		this.isShowed = false;
	}
}

/**
 * [AgeSelectorWidget description]
 * @param {[type]} app [description]
 */
var AgeSelectorWidget = function(app) {
	this.app = app;
	this.ages = [2012, 2011]
	this.selectedAge = 2012;
	this.CSS = {
		"SELECTOR": "#age_select"
	}

	this.elements = {
		"SELECTOR": $(this.CSS["SELECTOR"])
	}

	this.draw = function() {
		var self = this;
		self.elements["SELECTOR"].html("");
		$.each(this.ages, function(key, value) {
			var selected = "";
			if(value == self.currentAge) {
				selected = 'selected="selected"';
			}
			var html = '<option '+selected+' value="'+value+'">'+value+'</option>';
			self.elements["SELECTOR"].append(html);
		});
		this.elements["SELECTOR"].selectbox({
			effect: "slide",
			onChange: $.proxy(this.ageSelected_, this)
		});
	}

	this.ageSelected_ = function(val, inst) {
		this.selectedAge = val;
		var self = this;
		this.app.paramsManager.getParamsByRegionAndYeage(this.app.currentRegion, val, $.proxy(this.app.parametrsWidgets.getParametrs_, this.app.parametrsWidgets));
		if(this.app.parametrsWidgets.currentParametr) {
			this.app.mapColorel.colored(
				this.app.parametrsWidgets.currentParametr.id, 
				this.app.currentRegion, 
				this.app.ageSelectorWidget.selectedAge
			);
			this.app.mapColorWidget.updateParams();
			this.app.legendManager.getLegendByParamAndSubject(
				this.app.parametrsWidgets.currentParametr.id, 
				this.app.currentRegion,
				function(data) {
					//self.app.legendWidget.setLevelText(data);
					//self.app.legendWidget.show();
				}
			);
		}
	}
}

/**
 * [AgeSelectorWidget description]
 * @param {[type]} app [description]
 */
var AgeSelectorFormatWidget = function(app) {
	this.app = app;
	this.ages = [2012, 2011, 2010, 2009, 2008]
	this.selectedAge = 2012;
	this.CSS = {
		"SELECTOR": "#params-age-selected",
		"LOAD": "#load"
	}

	this.elements = {
		"SELECTOR": $(this.CSS["SELECTOR"])
	}

	this.draw = function() {
		var self = this;
		self.elements["SELECTOR"].html("");
		$.each(this.ages, function(key, value) {
			var selected = "";
			if(value == self.currentAge) {
				selected = 'selected="selected"';
			}
			var html = '<option '+selected+' value="'+value+'">'+value+'</option>';
			self.elements["SELECTOR"].append(html);
		});
		this.elements["SELECTOR"].selectbox({
			effect: "slide",
			onChange: $.proxy(this.ageSelected_, this)
		});
	}

	this.ageSelected_ = function(val, inst) {
		this.selectedAge = val;

		$(this.CSS["LOAD"]).addClass("onShow");
		this.app.formatWidget.updateContent();
	}
}

/**
 * [AgeSelectorWidget description]
 * @param {[type]} app [description]
 */
var AgeSelectorRegionsWidget = function(app) {
	this.app = app;
	this.ages = [2012]
	this.selectedAge = 2012;
	this.CSS = {
		"SELECTOR": "#regions_age_select",
		"LOAD": "#load"
	}

	this.elements = {
		"SELECTOR": $(this.CSS["SELECTOR"])
	}

	this.draw = function() {
		var self = this;
		self.elements["SELECTOR"].html("");
		$.each(this.ages, function(key, value) {
			var selected = "";
			if(value == self.currentAge) {
				selected = 'selected="selected"';
			}
			var html = '<option '+selected+' value="'+value+'">'+value+'</option>';
			self.elements["SELECTOR"].append(html);
		});
		this.elements["SELECTOR"].selectbox({
			effect: "slide",
			onChange: $.proxy(this.ageSelected_, this)
		});
	}

	this.ageSelected_ = function(val, inst) {
		this.selectedAge = val;

		$(this.CSS["LOAD"]).addClass("onShow");
		this.app.formatWidget.updateContent();
	}
}

/**
 * [FooterNavWidget description]
 * @param {[type]} app [description]
 */
var FooterNavWidget = function(app) {
	this.app = app;
	this.CSS = {
		"MAIN": "#footer-nav-widget",
		"PAGE-TITLE": "header h1"
	};
	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"PAGE-TITLE": $(this.CSS["PAGE-TITLE"])
	};
	this.items = {
		"MAP": {
			"title": "округа"
		},
		"REGIONS": {
			"title": "Регионы"
		},
		"FORMAT": {
			"title": "Формат"
		},
		"GRAPH": {
			"title": "График",
			"cooming": true
		},
		"EVENTS": {
			"title": "События",
			"cooming": true
		}
	}

	this.draw_ = function() {
		$.each(this.items, $.proxy(this.drawItem_, this));
	}
	this.drawItem_ = function(index, element) {
		var newElement = $('<a>'+element["title"]+'</a>');
		newElement.attr("data-id", index);
		if(element["cooming"]) {
			newElement.addClass("cooming");
		}
		if(index == "MAP") {
			newElement.addClass("active");
		}
		this.elements["MAIN"].append(newElement);
	}
	this.addEvents_ = function() {
		$(this.CSS["MAIN"]).find("a").on("click", $.proxy(this.onItemClick_, this));
	}
	this.onItemClick_ = function(evt) {
		var curElement = $(evt.target);
		var itemId = curElement.attr("data-id");

		if(!curElement.hasClass("cooming")) {
			if(itemId == "GRAPH") {
				this.app.mapStateManager.addBlur();
				this.app.mapStateManager.miniMapWriter.opacityHidden();
				this.app.mapColorel.hidden();
				this.app.mapStateManager.SVGWriter.hide();
				this.app.parametrsWidgets.fullHidden();
				this.app.regionsParametrsWidgets.fullHidden();
				this.app.legendWidget.hide();
				this.app.regionsLegendWidget.hide();
				this.app.regionsSelectorWidget.hidden();
				this.app.paramsSelectorWidget.hidden();
				this.app.formatWidget.hidden();
				this.app.regionPanel.addBlur();
				this.app.graphParamsSelector.show();
				this.app.graphRegionsSelectorWidget.show();
				this.app.graphWidget.show();
			}
			
			if(itemId == "FORMAT") {
				this.app.mapStateManager.addBlur();
				this.app.mapStateManager.miniMapWriter.opacityHidden();
				this.app.mapColorel.hidden();
				this.app.mapStateManager.SVGWriter.hide();
				this.app.parametrsWidgets.fullHidden();
				this.app.regionsParametrsWidgets.fullHidden();
				this.app.legendWidget.hide();
				this.app.regionsLegendWidget.hide();
				this.app.regionsSelectorWidget.show();
				this.app.paramsSelectorWidget.show();
				this.app.formatWidget.show();
				this.app.regionPanel.hide();
				this.app.graphParamsSelector.hidden();
				this.app.graphRegionsSelectorWidget.hidden();
				this.app.graphWidget.hidden();
			}

			if(itemId == "REGIONS") {
				this.app.mapStateManager.miniMapWriter.opacityHidden();
				
				this.app.mapStateManager.SVGWriter.show();
				this.app.parametrsWidgets.fullHidden();
				this.app.regionsSelectorWidget.hidden();
				this.app.paramsSelectorWidget.hidden();
				this.app.formatWidget.hidden();
				this.app.regionPanel.setBg();
				this.app.regionPanel.show();
				this.app.regionPanel.removeBlur();
				this.app.regionsParametrsWidgets.fullShow();
				this.app.mapColorel.hidden();
				this.app.legendWidget.hide();
				this.app.regionsMapColorWidget.updateParams();
				this.app.mapColorel.hidden();
				this.elements["PAGE-TITLE"].addClass("onHidden");
				this.app.graphParamsSelector.hidden();
				this.app.graphRegionsSelectorWidget.hidden();
				this.app.graphWidget.hidden();

				if(this.app.regionsParametrsWidgets.currentParametr) {
					//this.app.regionsLegendWidget.show();
				}
			}
			if(itemId == "MAP") {
				this.app.mapStateManager.removeBlur();
				if(this.app.currentZoom != 1) {
					this.app.mapStateManager.miniMapWriter.opacityShow();	
				}
				
				this.app.regionsLegendWidget.hide();
				this.app.mapStateManager.SVGWriter.show();
				this.app.mapStateManager.SVGWriter.load(this.app.configManager.getSvgById(this.app.currentRegion));
				this.app.parametrsWidgets.fullShow();
				this.app.regionsParametrsWidgets.fullHidden();
				this.app.regionsSelectorWidget.hidden();
				this.app.paramsSelectorWidget.hidden();
				this.app.formatWidget.hidden();
				this.app.regionPanel.hide();
				this.app.mapColorWidget.updateParams();
				this.app.mapColorel.show();
				this.elements["PAGE-TITLE"].removeClass("onHidden");
				this.app.graphParamsSelector.hidden();
				this.app.graphRegionsSelectorWidget.hidden();
				this.app.graphWidget.hidden();

				if(this.app.parametrsWidgets.currentParametr) {
					//this.app.legendWidget.show();
				}
			}
		}

		

		if(!curElement.hasClass("cooming")) {
			if(!curElement.hasClass("active")) {
				$(this.CSS["MAIN"]).find("a").removeClass("active");
				curElement.toggleClass("active");		
			}
		}
	}

	this.draw = function() {
		this.draw_();
		this.addEvents_();	
	}

	this.hidden = function() {
		this.elements["MAIN"].removeClass("onShow");
	}
}

/**
 * [GraphRegionsSelectorWidget description]
 * @param {[type]} app [description]
 */
var GraphRegionsSelectorWidget = function(app) {
	this.app = app;
	this.CSS = {
		"MAIN": "#graph-regions-selector",
		"HIDDEN": "hidden",
		"SHOW": "#graph-regions-nav-show",
		"DATA": "#graph-region-data",
		"DATA-HIDDEN": "#graph-region-data-hidden",
		"DATA-PLACE": "#graph-region-data-place",
		"FILTER": "#graph-region-selector-filter",
		"LOAD": "#load"
	};

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"SHOW": $(this.CSS["SHOW"]),
		"DATA": $(this.CSS["DATA"]),
		"DATA-HIDDEN": $(this.CSS["DATA-HIDDEN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"]),
		"FILTER": $(this.CSS["FILTER"])
	}

	this.regions = {};

	this.isDataShow = false;
	this.scrollApi = null;

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
		this.initScroll_();
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.initScroll_ = function() {
		$(this.CSS["DATA-PLACE"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["DATA-PLACE"].data('jsp');
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShowClick_, this));
		this.elements["DATA-HIDDEN"].on("click", $.proxy(this.onHiddenClick_, this));
	}

	this.onRegionClick_ = function(evt) {
		var current = $(evt.target);
		var parent = $(evt.target).parent();

		$(evt.target).toggleClass("current");

		if(current.hasClass("current")) {
			parent.find("ul a").addClass("current");
		} else {
			parent.find("ul a").removeClass("current");
		}

		$(this.CSS["LOAD"]).addClass("onShow");
		//this.app.formatWidget.updateContent();
	}

	this.onRegionNameClick_ = function(evt) {
		$(evt.target).parent().find("ul").slideToggle("slow");
	}

	this.onShowClick_ = function(evt) {
		this.isDataShow = true;
		this.elements["DATA"].removeClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].addClass(this.CSS["HIDDEN"]);
	}

	this.onHiddenClick_ = function(evt) {
		this.isDataShow = false;
		this.elements["DATA"].addClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].removeClass(this.CSS["HIDDEN"]);
	}

	this.onResponseRegions_ = function(data) {
		this.regions = data;
		this.elements["DATA-PLACE"].html(this.findRegionsByParent_(data, this.app.russianId, "", ""));
		this.addChilds(data);

		this.app.paramsManager.getParamsByRegionAndAge(
			this.getCurrentIds(),
			this.app.ageSelectorFormatWidget.selectedAge,
			function() {
				
			}
		);

		this.app.graphParamsSelector.updateParams(this.getCurrentIds(), 2012);
			
		$(this.CSS["DATA-PLACE"]+ " li a").on("click", $.proxy(this.onRegionClick_, this));
		$(this.CSS["DATA-PLACE"]+ " li span").on("click", $.proxy(this.onRegionNameClick_, this));

		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));
		
	}

	this.findRegionsByParent_ = function(data, parent, html, sep) {
		html += "<ul>";
		var self = this;
		$.each(data, function(key, value) {
			if(parent == value.parent_id) {
				html += '<li data-name='+value.name+' data-id="'+value.id+'"><span class="group"> '+sep+value.name+'</span><a class="current" href="#"></a></li>';
				delete data[value];
			}
		});
		html += "</ul>";
		return html;
	}

	this.getCurrentIds = function() {
		var currentsA = $(this.elements["DATA-PLACE"]).find("li a.current");
		var ids = [];

		$.each(currentsA, function(key, value) {
			ids.push($(value).parent().attr("data-id"));
		});

		return ids;
	}

	this.addChilds = function(data) {
		var self = this;
		$.each($(this.elements["DATA-PLACE"]).find("li"), function(key, value) {
			var html = self.findRegionsByParent_(data, $(value).attr("data-id"), "", " - ");
			$(value).append(html);
		});
	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();

		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);	
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["DATA-PLACE"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["DATA-PLACE"]).find("ul li ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});
	}

	this.bindEvents_();
	this.app.regionManager.getAll($.proxy(this.onResponseRegions_, this));
}

/**
 * [RegionsSelector description]
 * @param {[type]} app [description]
 */
var RegionsSelectorWidget = function(app) {
	this.app = app;
	this.CSS = {
		"MAIN": "#regions-selector",
		"HIDDEN": "hidden",
		"SHOW": "#regions-nav-show",
		"DATA": "#region-data",
		"DATA-HIDDEN": "#region-data-hidden",
		"DATA-PLACE": "#region-data-place",
		"FILTER": "#region-selector-filter",
		"LOAD": "#load"
	};

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"SHOW": $(this.CSS["SHOW"]),
		"DATA": $(this.CSS["DATA"]),
		"DATA-HIDDEN": $(this.CSS["DATA-HIDDEN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"]),
		"FILTER": $(this.CSS["FILTER"])
	}

	this.regions = {};

	this.isDataShow = false;
	this.scrollApi = null;

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
		this.initScroll_();
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.initScroll_ = function() {
		$(this.CSS["DATA-PLACE"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["DATA-PLACE"].data('jsp');
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShowClick_, this));
		this.elements["DATA-HIDDEN"].on("click", $.proxy(this.onHiddenClick_, this));
	}

	this.onRegionClick_ = function(evt) {
		var current = $(evt.target);
		var parent = $(evt.target).parent();

		$(evt.target).toggleClass("current");

		if(current.hasClass("current")) {
			parent.find("ul a").addClass("current");
		} else {
			parent.find("ul a").removeClass("current");
		}

		$(this.CSS["LOAD"]).addClass("onShow");
		this.app.formatWidget.updateContent();
	}

	this.onRegionNameClick_ = function(evt) {
		$(evt.target).parent().find("ul").slideToggle("slow");
	}

	this.onShowClick_ = function(evt) {
		this.isDataShow = true;
		this.elements["DATA"].removeClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].addClass(this.CSS["HIDDEN"]);
	}

	this.onHiddenClick_ = function(evt) {
		this.isDataShow = false;
		this.elements["DATA"].addClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].removeClass(this.CSS["HIDDEN"]);
	}

	this.onResponseRegions_ = function(data) {
		this.regions = data;
		this.elements["DATA-PLACE"].html(this.findRegionsByParent_(data, this.app.russianId, "", ""));
		this.addChilds(data);

		this.app.paramsManager.getParamsByRegionAndAge(
			this.getCurrentIds(),
			this.app.ageSelectorFormatWidget.selectedAge,
			function() {
				
			}
		);

		this.app.paramsSelectorWidget.updateParams(this.getCurrentIds(), this.app.ageSelectorFormatWidget.selectedAge);
			
		$(this.CSS["DATA-PLACE"]+ " li a").on("click", $.proxy(this.onRegionClick_, this));
		$(this.CSS["DATA-PLACE"]+ " li span").on("click", $.proxy(this.onRegionNameClick_, this));

		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));
		
	}

	this.findRegionsByParent_ = function(data, parent, html, sep) {
		html += "<ul>";
		var self = this;
		$.each(data, function(key, value) {
			if(parent == value.parent_id) {
				html += '<li data-name='+value.name+' data-id="'+value.id+'"><span class="group"> '+sep+value.name+'</span><a class="current" href="#"></a></li>';
				delete data[value];
			}
		});
		html += "</ul>";
		return html;
	}

	this.getCurrentIds = function() {
		var currentsA = $(this.elements["DATA-PLACE"]).find("li a.current");
		var ids = [];

		$.each(currentsA, function(key, value) {
			ids.push($(value).parent().attr("data-id"));
		});

		return ids;
	}

	this.addChilds = function(data) {
		var self = this;
		$.each($(this.elements["DATA-PLACE"]).find("li"), function(key, value) {
			var html = self.findRegionsByParent_(data, $(value).attr("data-id"), "", " - ");
			$(value).append(html);
		});
	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();

		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);	
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["DATA-PLACE"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["DATA-PLACE"]).find("ul li ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});
	}

	this.bindEvents_();
	this.app.regionManager.getAll($.proxy(this.onResponseRegions_, this));
}

/**
 * [RegionsSelector description]
 * @param {[type]} app [description]
 */
var ParamsSelectorWidget = function(app) {
	this.app = app;
	this.CSS = {
		"MAIN": "#params-selector",
		"HIDDEN": "hidden",
		"SHOW": "#params-nav-show",
		"DATA": "#params-data",
		"DATA-HIDDEN": "#params-data-hidden",
		"DATA-PLACE": "#params-data-place",
		"LOAD": "#load"
	};

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"SHOW": $(this.CSS["SHOW"]),
		"DATA": $(this.CSS["DATA"]),
		"DATA-HIDDEN": $(this.CSS["DATA-HIDDEN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"]),
		"FILTER":  $(this.CSS["DATA"]).find("input")
	}

	this.isDataShow = false;
	this.parametrs = {};
	this.scrollApi = null;

	this.initScroll_ = function() {
		$(this.CSS["DATA-PLACE"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["DATA-PLACE"].data('jsp');
	}

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShowClick_, this));
		this.elements["DATA-HIDDEN"].on("click", $.proxy(this.onHiddenClick_, this));

		$(this.CSS["DATA-PLACE"]).on("click", ".params-checkbox" , $.proxy(this.onParamClick_, this));
		$(this.CSS["DATA-PLACE"]).on("click", ".params-name", $.proxy(this.onParamNameClick_, this));

		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));
	}

	this.onShowClick_ = function(evt) {
		this.isDataShow = true;
		this.elements["DATA"].removeClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].addClass(this.CSS["HIDDEN"]);
	}

	this.onHiddenClick_ = function(evt) {
		this.isDataShow = false;
		this.elements["DATA"].addClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].removeClass(this.CSS["HIDDEN"]);
	}

	this.onParamsGet_ = function(data) {
		this.parametrs = this.prepareParamerts_(data);
		this.drawParamets_(this.parametrs);

		this.app.formatWidget.updateContent();
	}

	this.updateParams = function(ids, age) {
		this.app.paramsManager.getParamsByRegionAndAge(
			ids,
			age,
			$.proxy(this.onParamsGet_, this)
		);
	}

	this.drawParamets_ = function(params) {
		if(!this.scrollApi) {
			this.initScroll_();
		}
		var html = "";
		var self = this;
		var contentPane = this.scrollApi.getContentPane();

		$.each(params, function(key, value) {
			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["DATA-PLACE"]);
			if(elementCurrentGroup.size() == 0) {
				var html =  "<ul data-id='"+value.id+"' class='first'><li class='first-li'>";
					html += "<span class='group params-name params-checkbox'>"+value.name+"</span><a href='#' class='params-checkbox current'></a>";
					html += "<ul></ul></li></ul>";

				contentPane.append(html);
			}

			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["DATA-PLACE"]);

			if(value.parameters.length > 0) {
				$.each(value.parameters, function(key2, value2) {
					var paramCurrent = $("li[data-id='"+value2.id+"']", self.CSS["DATA-PLACE"]);
					if(paramCurrent.size() == 0) {
						var html = "<li data-name='"+value2.name+"' data-id='"+value2.id+"'><span  class='param params-name '><em class='spr'>-</em> <em class='name'>"+value2.name+"</em></span><a class='params-checkbox current' href='#'></a></li>";

						elementCurrentGroup.find("ul").append(html);
					} else {
						paramCurrent.find("i").html(value2.value);
					}
				});	
			}
		});
		this.scrollApi.reinitialise();
	}

	this.prepareParamerts_ = function(data) {
		var ret = {};

		$.each(data, function(key, value) {
			if(!ret[value.group_id]) {
				ret[value.group_id] = {
					id: value.group_id,
					name: value.group_name,
					parameters: []
				}
			}
			ret[value.group_id].parameters.push({
				id: value.id,
				name: value.name,
				value: value.param_val
			});
		});

		return ret;
	}

	this.onParamClick_ = function(evt) {
		var current = $(evt.target);
		var parent = $(evt.target).parent();

		$(evt.target).toggleClass("current");

		if(current.hasClass("current")) {
			parent.find("ul a").addClass("current");
		} else {
			parent.find("ul a").removeClass("current");
		}

		$(this.CSS["LOAD"]).addClass("onShow");
		this.app.formatWidget.updateContent();
	}

	this.onParamNameClick_ = function(evt) {
		$(evt.target).parent().find("ul").slideToggle("slow");
	}

	this.getCurrentIds = function() {
		var currentsA = $(this.elements["DATA-PLACE"]).find("li a.current");
		var ids = [];

		$.each(currentsA, function(key, value) {
			ids.push($(value).parent().attr("data-id"));
		});

		return ids;
	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();

		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);	
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["DATA-PLACE"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["DATA-PLACE"]).find("ul li ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});

		/*
		var elems = $(this.CSS["DATA-PLACE"]).find("li");
		$.each(elems, function(key, value) {
			if($(value).find("li:not(.hidde)").size() == 0) {
				$(value).addClass("hidde");
			}
		})
		*/
	}

	this.initScroll_();
	this.bindEvents_();
	this.app.ageSelectorFormatWidget.draw();
	
}

/**
 * [FormatWidget description]
 * @param {[type]} app [description]
 */
var FormatWidget = function(app) {
	this.app = app;
	this.scrollApi = null;
	this.CSS = {
		"MAIN": "#format-data",
		"HIDDEN": "hidden",
		"DATA-PLACE": "#table-format",
		"LOAD": "#load"
	}

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"])
	}

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.updateContent = function() {
		this.app.formatManager.getFormat(
			this.app.regionsSelectorWidget.getCurrentIds(),
			this.app.paramsSelectorWidget.getCurrentIds(),
			this.app.ageSelectorFormatWidget.selectedAge,
			$.proxy(this.draw_, this)
		);
	}

	this.draw_ = function(data) {
		$(this.CSS["LOAD"]).removeClass("onShow");

		var contentPane = this.scrollApi.getContentPane();
		var self = this;
		var main = this.elements["MAIN"].find("tbody");

		main.html("");
		$.each(data, function(key, value) {
			var html = "<tr>";
			html += '<td>'+value.parameter_name+'</td><td>'+value.subject_name+'</td><td>'+value.val_numeric+'</td><td>'+value.year+'</td>';
			html += "</tr>";
			main.append(html);
		});
		self.scrollApi.reinitialise();
	}

	this.initScroll_ = function() {
		$(this.CSS["DATA-PLACE"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["DATA-PLACE"].data('jsp');
	}

	this.initScroll_();
}


/**
 * [GraphWidget description]
 * @param {[type]} app [description]
 */
var GraphWidget = function(app) {
	this.app = app;
	this.scrollApi = null;
	this.CSS = {
		"MAIN": "#graph-content",
		"HIDDEN": "hidden",
		"LOAD": "#load",
		"GRAPH": "#graph-panel",
		"DATES": "#graph-datas",
		"DATA-BEGIN": "#graph-datas-begin",
		"DATA-END": "#graph-datas-end"
	}

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"DATA-BEGIN": $(this.CSS["DATA-BEGIN"]),
		"DATA-END": $(this.CSS["DATA-END"])
	}

	this.addCalendars_ = function() {
		this.elements["DATA-BEGIN"].datepick();
		this.elements["DATA-END"].datepick();
	}

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.updateContent = function() {
		this.app.formatManager.getFormat(
			this.app.regionsSelectorWidget.getCurrentIds(),
			this.app.paramsSelectorWidget.getCurrentIds(),
			this.app.ageSelectorFormatWidget.selectedAge,
			$.proxy(this.draw_, this)
		);
	}

	this.draw_ = function(data) {
	}

	this.addCalendars_();
}