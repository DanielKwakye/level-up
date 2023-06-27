var isLogged = false;
var user_data = localStorage.user_data ? JSON.parse(localStorage.user_data) : null;

// page access
var component = null;
var login = null;
var home = null;
var brand = null;
var details = null;
var outlet = null;
var user = null;
var profile = null;
var inbox = null;
var message = null;
var voucher = null;
var vlist = null;
var vdetails = null;
var vall = null;
var scan = null;

var pxr = 1;
var backCount = 0;
var safeTop = 0;
var safeBtm = 0;
var isBackward = false;
var panel = null;
var cameraOn = false;


$(function() {
	
	pxr = window.devicePixelRatio;
	var fhd = window.screen.width * pxr >= 1080;
	var sheet = window.document.styleSheets[0];
	sheet.insertRule('html { --f7-device-pixel-ratio:'+pxr+'!important; --division:'+(!fhd||(isIphone()&&iPhoneVersion().indexOf("X"))==-1?2:3)+'; --wh:'+($(window).height())+'px }', sheet.cssRules.length);

	document.addEventListener("deviceready", function() {
		
		FirebasePlugin.setAnalyticsCollectionEnabled(true);
		
		pxr = window.devicePixelRatio;
		StatusBar.getInsets(function(inset) {
			document.documentElement.style.setProperty('--f7-safe-area-top', (inset.top/pxr)+"px");
			document.documentElement.style.setProperty('--f7-statusbar-height', (inset.top/pxr)+"px");
			document.documentElement.style.setProperty('--f7-safe-area-bottom', (inset.bottom/pxr)+"px");
			safeTop = inset.top/pxr;
			safeBtm = inset.bottom/pxr;
			Keyboard.setTopSafeArea(inset.top);
		});
		StatusBar.overlaysWebView(true);
		app.statusbar.setTextColor('black');
		
		var sheet = window.document.styleSheets[0];
		var fs = (3/pxr*18).toFixed(2);
		var isRetina = window.matchMedia("(-webkit-min-device-pixel-ratio: 2)").matches;
		sheet.insertRule('html { --f7-device-pixel-ratio:'+pxr+'!important; --f7-retina:'+(isRetina?2:3)+'; }', sheet.cssRules.length);
		
		
		window.plugins.OneSignal
			.startInit('46e5983d-3414-4bfd-b12f-d0f5af3f287c')
			.inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
			.handleNotificationOpened(function(json) {
				var payload = json.notification.payload.additionalData;
				console.log(json);
				var id = payload.inbox_id;
				if (id) {
					if (!inbox) inbox = {};
					inbox.selected_id = id;
					router.navigate('/message/');
				}
				//router.navigate('/inbox/');
			})
			.handleNotificationReceived(function(notificationData) {
				var payload = notificationData.payload;
			})
			.endInit();
		
		
		document.addEventListener("backbutton", function() {
			var url = router.currentRoute.url;
			if ($('.dialog.modal-in').length) app.dialog.close();
			else if ($('.popup.modal-in, .sheet-modal.modal-in').length) {
				if ($('.popup.modal-in').length) app.popup.close('.popup.modal-in');
				if ($('.sheet-modal.modal-in').length) app.sheet.close('.sheet-modal.modal-in');
			}
			else if ($('.actions-modal.modal-in').length) {
				app.actions.close('.actions-modal.modal-in');
			}
			else if ($('.panel-in').length) {
				app.panel.close();
			}
			else if (url.indexOf('main') > -1 || url.indexOf('login') > -1 || url.indexOf('home') > -1 || url == '/') {
				grid_sheet.open();
			}
			else if (component && typeof component.customBack == 'function') {
				component.customBack();
			}
			else {
				router.back();
			}
			
		}, false);
		
		window.addEventListener('keyboardDidHide', function(e) {
			$('body').removeClass('keyboard-shown');
		});
		
		window.addEventListener('keyboardDidShow', function(e) {
			$('body').addClass('keyboard-shown');
		});
		
		if (localStorage.remember_me == '0') localStorage.removeItem('session_id');
		$('.animate1>img, .animate2>img').css('transform', 'translate3d(0,0,0)');
		
		$('body').animate({
			'opacity': '1'
		}, 300, 'swing', function() {
			setTimeout(function() {
				checkLogged(1, function(st) {
					if (st) router.navigate('/main/');
					else $('.splash-btn').css('opacity', '1');
				});
			}, 700);
		});
		

	}, false);	
	
	scan_toast = app.toast.create({
		text: 'Scan',
		position: 'center',
		closeTimeout: 1000
	});
	
	router.on('routeChange', function(currRoute, prevRoute, router) {
		
		if (cameraOn) {
			QRScanner.destroy(function(status) {
				removeTransparency();
			});
		}
		
		var curl = currRoute.url;
		var purl = prevRoute.url;
		$('[data-name="main"]').removeClass('page-with-subnavbar');
		$('.event-subnavbar').hide();
		$('.notification-subnavbar').hide();
		
		if (curl.indexOf('/main/') > -1) {
	
		}
			
		switch (curl) {
			
			case '/login/':
				component = login;
				break;
			
			case '/main/':
				component = home;
				break;
				
			case '/main/event/':
				component = cevent;
				$('[data-name="main"]').addClass('page-with-subnavbar');
				$('.event-subnavbar').show();
				break;
				
			case '/main/scan/':
				component = scan;/*
				QRScanner.prepare(onDone);
				applyTransparency();*/
				break;
			
				
			default: break;
			
		}

	}).on('routeChanged', function(currRoute, prevRoute, router) {
		
		var curl = currRoute.url;
		var purl = prevRoute.url;
		
	});
	
	grid_sheet = app.actions.create({
		grid: true,
		buttons: [
			[
				{
					text: 'Close',
					icon: '<i class="f7-icons icon" style="transform:scale(0.6)">power</i>',
					onClick: function() {
						navigator.app.exitApp();
					}
				},
				{
					text: 'Minimize',
					icon: '<i class="f7-icons icon" style="transform:scale(0.6)">rectangle_stack_badge_minus</i>',
					onClick: function() {
						window.plugins.appMinimize.minimize();
					}
				},
				{
					text: 'Cancel',
					icon: '<i class="f7-icons icon" style="transform:scale(0.6)">return</i>',
					onClick: function() {
						/*QRScanner.prepare(onDone, { formats: [ 'CODE_128', 'QR_CODE', 'EAN_13' ] });
						applyTransparency();*/
						app.actions.close('.actions-modal.modal-in');
					}
				},
			]
		]
	});
	
});


function checkLogged(time, callback) {
	
	time = time ? time : 1000;
	actions.check_logged(function(json) {
		
		isLogged = json.status == 'OK' && JSON.stringify(json.data.session) != '[]';
		user_data = json.data;
		localStorage.session_id = json.data.session_id;
		
		setTimeout(function() {
				if (callback) callback(isLogged);
		}, time);
	});
}

function openImagePicker(elem) {
	var resultMedias=[];
	var args = {
			'selectMode': 100, //101=picker image and video , 100=image , 102=video
			'maxSelectCount': 1, //default 40 (Optional)
			'maxSelectSize': 188743680, //188743680=180M (Optional) 
	};

	MediaPicker.getMedias(args, function(medias) {
			//medias [{mediaType: "image", path:'/storage/emulated/0/DCIM/Camera/2017.jpg', uri:"android retrun uri,ios retrun URL" size: 21993}]
			resultMedias = medias;
			getThumbnail(medias, elem);
	}, function(e) { console.log(e) });
}
	

function loadingUI() {}

function getThumbnail(medias, elem) {

	for (var i = 0; i < medias.length; i++) {
		//medias[i].thumbnailQuality=50; (Optional)
		//loadingUI(); //show loading ui
		
		MediaPicker.extractThumbnail(medias[i], function(data) {
			elem.css('background-image', 'url("data:image/jpeg;base64,' + data.thumbnailBase64 + '")').attr('data-src', data.thumbnailBase64);
			
			
		}, function(e) { console.log(e) });
	}
}

function numberWithCommas(x, d) {
  return parseFloat(x);
   //return parseFloat(x).toFixed((d!=null?d:2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function onDone(err, status){
  if (err) {
   console.error(err);
  }
  if (status.authorized) {
		QRScanner.scan(displayContents);
		QRScanner.show();
	} 
	else if (status.denied) {
		QRScanner.openSettings();
  } else {
    QRScanner.openSettings();
  }
}

function applyTransparency() {
	cameraOn = true;
	$('html, body, #app, .view-main, .page-current, #scan-tab').addClass('bg-transparent');
	$('.page-previous, .page[data-name="splash"] img').addClass('transparent');
	toast('Scan');
}

function removeTransparency() {
	cameraOn = false;
	$('.bg-transparent').removeClass('bg-transparent');
	$('.transparent').removeClass('transparent');
}

function displayContents(err, text) {
	if (err){
		
	} else {
		toast(text);
		QRScanner.destroy(function(status){
			removeTransparency();
		});
	}
}


function toast(msg) {
	app.toast.create({
		text: msg,
		position: 'bottom',
		closeTimeout: 2500,
	}).open();
}

function comingSoon() {
	toast('Coming soon');
}

function iPhoneVersion() {
  var iHeight = window.screen.height;
  var iWidth = window.screen.width;

  if (iWidth === 414 && iHeight === 896) {
    return "Xmax-Xr";
  }
  else if (iWidth === 375 && iHeight === 812) {
    return "X-Xs";
  }
  else if (iWidth === 320 && iHeight === 480) {
    return "4";
  }
  else if (iWidth === 375 && iHeight === 667) {
    return "6";
  }
  else if (iWidth === 414 && iHeight === 736) {
    return "6+";
  }
  else if (iWidth === 320 && iHeight === 568) {
    return "5";
  }
  else if (iHeight <= 480) {
    return "2-3";
  }
	else {
		return "X";
	}
  return 'none';
}

function isIphone() {
  return !!navigator.userAgent.match(/iPhone/i);
}

function getCurrentLocation(callback) {
	

		navigator.geolocation.getCurrentPosition(function(pos) {
			console.log('Latitude: '          + pos.coords.latitude          + '\n' +
						'Longitude: '         + pos.coords.longitude         + '\n' +
						'Altitude: '          + pos.coords.altitude          + '\n' +
						'Accuracy: '          + pos.coords.accuracy          + '\n' +
						'Altitude Accuracy: ' + pos.coords.altitudeAccuracy  + '\n' +
						'Heading: '           + pos.coords.heading           + '\n' +
						'Speed: '             + pos.coords.speed             + '\n' +
						'Timestamp: '         + pos.timestamp                + '\n');
			callback(pos);			
						
		}, function(err) {
			console.log('code: '    + err.code    + '\n' +
								'message: ' + err.message + '\n');
			
			//getLocationPermission();
								
								
		}, {
			enableHighAccuracy: true,
			timeout: 3000
		});
		
}

function logout() {
	
	app.dialog.confirm('Are you sure to logout?', 'Confirmation', function() {
		app.preloader.show();
		actions.log_out(function(json) {
			window.location.reload();
		});
	});
}

function getLocationPermission() {
	
	if (!requesting) {
		requesting = true;
		console.log('request permission');
		cordova.plugins.locationAccuracy.canRequest(function(canRequest) {
			console.log(canRequest);
			if (canRequest) {
				
				$('.icon-popup .icon-img>img').css({
					'width': 'calc(150pt / var(--ratio))', 
					'height': 'calc(150pt / var(--ratio))',
					'margin-top': 'calc(55pt / var(--ratio))'
				}).attr('src', 'img/icon/placeholder-white.png');
				$('.icon-popup .icon-title').text('FIVE requires access to location');
				$('.icon-popup .icon-desc').html('To enjoy all that station list FIVE has to recommend,<br>turn on your location.');
				$('.icon-popup .icon-subtitle').hide();
				$('.icon-popup .icon-extra').hide();
				$('.icon-popup .icon-pgs').show();
				app.popup.open('.icon-popup');
				
				$('.icon-gps>button').off().on('click', function() {
					cordova.plugins.locationAccuracy.request(function (success){
						
						requesting = false;
						console.log("Successfully requested accuracy: "+success.message);
						app.popup.close('.icon-popup');
						app.ptr.done();
						stationPtr.refresh();
							
					}, function (error){
						 
						requesting = false;
						console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
						if (error.code == cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
							app.popup.close('.icon-popup');
							app.ptr.done();
						}
					}, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
				});
			}
			else {
			 
				requesting = false;
			}
		});
	}
}