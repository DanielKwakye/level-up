var api_url = 'http://merchant.leveluphub.my/api/';
var requesting = 0;
var actions = {
	
	'check_logged' : function(callback, ecallback) {
		myAjax('GET', api_url + 'session', null, null, callback, ecallback);
	},
	'log_in' : function(data, callback, ecallback) {
		data.action = 'email_login';
		myAjax('POST', api_url + 'customer', null, data, callback, ecallback);
	},
	'log_out' : function(callback, ecallback) {
		var params = {
			'action':'logout',
			'data': {'test':1}
		};
		myAjax('POST', api_url + 'customer', null, params, callback, ecallback);
	},
	'register' : function(params, callback, ecallback) {
		params.action = 'register';
		myAjax('POST', api_url + 'customer', null, params, callback, ecallback);
	},
	'forget_password' : function(params, callback, ecallback) {
		params.action = 'forget_password';
		myAjax('POST', api_url + 'customer', null, params, callback, ecallback);
	},
	
	'get_banner_all' : function(callback, ecallback) {
		myAjax('GET', api_url + 'front_banner/action/all', null, null, callback, ecallback);
	},
	
	'get_brand_all' : function(callback, ecallback) {
		myAjax('GET', api_url + 'brand/action/all', null, null, callback, ecallback);
	},
	'get_brand_details' : function(id, callback, ecallback) {
		myAjax('GET', api_url + 'brand/action/details/brand_id/'+id, null, null, callback, ecallback);
	},
	'get_brand_branches' : function(id, callback, ecallback) {
		myAjax('GET', api_url + 'brand/action/branches/brand_id/'+id, null, null, callback, ecallback);
	},
	
	'get_category_all' : function(callback, ecallback) {
		myAjax('GET', api_url + 'vouchers/action/categories', null, null, callback, ecallback);
	},
	'get_voucher_all' : function(id, callback, ecallback) {
		myAjax('GET', api_url + 'vouchers/action/categories/brand_vouchers_category_id/'+id, null, null, callback, ecallback);
	},
	'get_voucher_details' : function(id, callback, ecallback) {
		myAjax('GET', api_url + 'vouchers/action/details/brand_vouchers_id/'+id, null, null, callback, ecallback);
	},
	'redeem_voucher' : function(params, callback, ecallback) {
		params.action = 'redeem';
		myAjax('POST', api_url + 'vouchers', null, params, callback, ecallback);
	},
	'get_own_vouchers' : function(callback, ecallback) {
		myAjax('GET', api_url + 'customer/action/get_own_vouchers', null, null, callback, ecallback);
	},
	'get_own_voucher_details' : function(id, callback, ecallback) {
		myAjax('GET', api_url + 'customer/action/get_voucher_details/customer_voucher_id/'+id, null, null, callback, ecallback);
	},
	
	
	'get_profile': function(callback, ecallback) {
		myAjax('GET', api_url + 'customer/action/details', null, null, callback, ecallback);
	},
	'update_profile' : function(params, callback, ecallback) {
		params.action = 'edit_own';
		myAjax('POST', api_url + 'customer', null, params, callback, ecallback);
	},
	'get_referrals': function(callback, ecallback) {
		myAjax('GET', api_url + 'customer/action/get_own_referrals', null, null, callback, ecallback);
	},
	'add_referral' : function(params, callback, ecallback) {
		params.action = 'add_referral';
		myAjax('POST', api_url + 'customer', null, params, callback, ecallback);
	},
	
	'get_inbox': function(callback, ecallback) {
		myAjax('GET', api_url + 'notification/action/all', null, null, callback, ecallback);
	},
	'get_message': function(id, callback, ecallback) {
		myAjax('GET', api_url + 'notification/action/details/inbox_id/'+id, null, null, callback, ecallback);
	},
	'remove_message' : function(params, callback, ecallback) {
		params.action = 'delete';
		myAjax('POST', api_url + 'notification', null, params, callback, ecallback);
	}
};




function myAjax(method, url, headers, data, callback, ecallback) {
	
	requesting += 1;
	if (headers == null) headers = {
		//"Authorization" : "Basic Rml2ZUFQUDpNYWQxMzgxMzgxMzhBbmltYXRpb25TdHVkaW9z"
	};
	if (localStorage.session_id != null) headers['X-Oc-Session'] = localStorage.session_id;
	
	$.ajax({
		'type' : method,
		'url' : url,
		'xhrFields' : { withCredentials: false },
		'crossDomain' : true,
		'headers' : headers,
		'data' : data,
		'dataType' : 'json',
		'success' : function(responseData, textStatus, jqXHR) {
			var value = responseData.someKey;
			console.log(responseData);
			if (responseData.status == 'OK') {
				callback(responseData);
			}
			else {
				toast(responseData.message);
				if (typeof ecallback == 'function') ecallback(responseData);
			}
			requesting -= 1;
			setTimeout(function() {
				if (requesting == 0) app.preloader.hide();
			}, 50);
		},
		'error' : function (responseData, textStatus, errorThrown) {
			requesting -= 1;
			if (responseData.readyState == 0 && responseData.status == 0) {
				
			}
			console.log('responseData: '+ JSON.stringify(responseData));
			console.log('errorThrown: ' + errorThrown);
			app.preloader.hide();
			app.dialog.close();
			toast("Something goes wrong... Try again later");
		}
	});
}
