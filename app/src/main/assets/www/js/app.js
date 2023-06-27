var app = new Framework7({
  root: '#app',
  name: 'LevelUpHub',
	theme: 'md',
  // App id
  id: 'com.madbiz.seh',
  /*panel: {
    swipe: 'right',
		swipeActiveArea: 20,
		swipeNoFollow: false
  },*/
	card: {
    swipeToClose: false
  },
/*	toolbar: {
    hideOnPageScroll: true,
		showOnPageScrollEnd: false,
		showOnPageScrollTop: true
  },*/
	view:{
		stackPages:true,
		animate : true,
	},
	template7Pages: true
  // ... other parameters
});

var mainView = app.views.create('.view-main', {
	unloadTabContent: false,
	routes: [{
		path: '/',
		url: './index.html',
	}, {
		path: '/register/',
		componentUrl: './register.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/login/',
		componentUrl: './login.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/forgot/',
		componentUrl: './forgot.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/main/',
		componentUrl: './main.html',
		options: {
      transition: 'f7-parallax',
    },
		tabs: [
			{
				path: '/',
				id: 'home-tab',
				componentUrl: './home.html'
			},
			{
				path: '/brand/',
				id: 'brand-tab',
				componentUrl: './brand.html'
			},
			{
				path: '/scan/',
				id: 'scan-tab',
				componentUrl: './scan.html'
			},
			{
				path: '/user/',
				id: 'user-tab',
				componentUrl: './user.html'
			}
		]
	}, {
		path: '/about/',
		componentUrl: './about.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/privilege/',
		componentUrl: './privilege.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/benefit/',
		componentUrl: './benefit.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/how/',
		componentUrl: './how.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/details/',
		componentUrl: './details.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/outlet/',
		componentUrl: './outlet.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/profile/',
		componentUrl: './profile.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/eprofile/',
		componentUrl: './eprofile.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/epassword/',
		componentUrl: './epassword.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/barcode/',
		componentUrl: './barcode.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/reward/',
		componentUrl: './reward.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/voucher/',
		componentUrl: './voucher.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/vall/',
		componentUrl: './vall.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/vlist/',
		componentUrl: './vlist.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/vdetails/',
		componentUrl: './vdetails.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/redeem/',
		componentUrl: './redeem.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/inbox/',
		componentUrl: './inbox.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/message/',
		componentUrl: './message.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/contact/',
		componentUrl: './contact.html',
		options: {
      transition: 'f7-parallax',
    }
	}, {
		path: '/refer/',
		componentUrl: './refer.html',
		options: {
      transition: 'f7-parallax',
    }
	}]
});
var router = mainView.router;