// ==UserScript==
// @name          Chimera
// @namespace     c
// @include       *www.howrse.com*
// @include       *au.howrse.com*
// @include       *ca.howrse.com*
// @include       *us.howrse.com*
// @include       *.howrse.co.uk*
// @version       0.4.15
// @run-at        document-start
// @noframes      true
// @grant         unsafeWindow
// @grant         DOMAttrModified
// @grant         GM_log
// @grant         GM_info
// @grant         GM_openInTab
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_listValues
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @grant         GM_setClipboard
// @grant         window.close
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @require       https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/jquery-ui.min.js
// @require       https://raw.githubusercontent.com/jeresig/jquery.hotkeys/master/jquery.hotkeys.js
// @require       https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// ==/UserScript==
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* =========  D I S C L A I M E R  =========

   Use of this software is entirely at your own risk. No guarantee can be given that you won't be banned or penalized
   from use of this software. While I go to every effort to ensure Chimera avoids detection, nothing is perfect and I
   take no responsibility for the loss of your account and or anything relating to it.
   
   To repeat: Use Chimera at your own risk.



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   =========  T E R M S   O F   U S E  =========

   In using Chimera you automatically agree to the following terms and conditions of use:
   
      (i)   You will not distribute Chimera without prior permission from the author, listed above
      (ii)  You will not attempt to sell Chimera or use Chimera's features on others' accounts for profit
      (iii) You will not make any attempt to reverse engineer or circumvent any access protections within Chimera



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   =========  P O T E N T I A L   A N D   K N O W N   I S S U E S   &   B U G S  =========

      Anything may not work. Be mindful and not overly reliant on anything Chimera does. Specifics added below:

 - 



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   =========  P L A N N E D   F E A T U R E S  =========

 - Automatic covering offers
 - Option to board in own EC's reserved spaces over public centres
 - Use of https://github.com/uzairfarooq/arrive to more quickly remove unwanted page elements
 - Competition auto-scroll based on name/affix



*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* =========  G L O B A L   C O N S T A N T S  ========= */

'use strict';

const U     = 'undefined',
      S     = 'string', 
      B     = 'boolean',
      N     = 'number',
      F     = 'function',
      O     = 'object',
      UW    = unsafeWindow,
      EV    = unsafeWindow.eval,
      URL   = document.location.href,
      MenuWidth   = 1020,
      MenuHeight  = 360,
      WaitTimer   = 100,
      VERSION     = GM_info.script.version,
      ICON  = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZV'
            + 'JlYWR5ccllPAAACXpJREFUeNqkV2dMVN0WZRpTGGaYAaSDIggMKiAd6WAvsSUae0ssifrD3qLG2FtijT22xKg/7Mbee8OOFUUQlQ4jMD'
            + 'DlW4s3Q0bes3x5NzmBuffcvffZe+211xVYLBaHf3M9ffpUefPmTReuvLw8aW1trcTNza2ubdu2NZmZmeWxsbFVHh4ehr+1J/ibAL5+/S'
            + 'o9ePCgx5EjR9zfvHkjFwqFDhqNpkGlUplEIpEFQQgrKirEVVVVYrVabUpOTq4YNmzYt6ysrDLs/b0DBvCrRYMLFiwIhNFUFxeX1BEjRu'
            + 'iOHj3q/unTJ5nZbBY035uTk6Ncu3atf2JiYgwCy4iPj4+9cOGC9nc+fvng3r176rCwsES5XJ6+aNGiwNLSUontmV6vF+fm5jrdvXtXzV'
            + 'I8efLEuaioSGr//q1bt1y6du0aJRAIsiZPntympqZG+NcBHDp0yEMsFmdkZ2d34Gl579u3b44bN2706969e0RAQECiRCJJRwKzuOAkA3'
            + 'XviCt66dKlrV69euVks7Vr1y5vmUyWjiu6uLjY8Y8BHD582ANGsydMmBDC39XV1aI5c+YEAWgpuN/ZujLd3d07tmzZMtHLyysJwTKYbD'
            + '5LSEiIS0pKip03b16QzSYDwr7kmJiY+PLycom9v59AeP/+fTXqFg3nBZs2bXrD9I4ePToUwHNRKBS1/fv3L+7WrVtZcHBwLU5tgWMuB/'
            + '7/+vVrxYEDBzyAFXPfvn2/Aw+qgoICSUlJiWT+/Pmf8H4DsQH7VcePH39qA2dTAKxrVFRUrJ+fn+HSpUuPTp065d6vX7+29fX1wqlTp+'
            + 'YDgF9hUHb69GktjDvRMJ4JnJyczD4+Poa0tLSqHj16lMCOEAAVTZo0qXWLFi2Mb9++lU2cOLEINj7euXNHzSBWrVr1btq0aZ9+6oK5c+'
            + 'e2JuC+fPkihQNn1DgDwXS8fv265saNGy6oYZSt5ixBs8V72VKpNB0Z0xEv27Zt8+EznDgOK4bZpR8AuhVtf/jwQd6EgcLCQimcpyGyAP'
            + '4ODQ1NCAoKSnr//r0TQNUSKc601jjDutJ/sfgsm4FfvnxZM3369GDgpOOMGTOCmN3169f7sn39/f2Txo4dG9oUwIoVKwK0Wm1KXV2daM'
            + 'OGDX4gmNQXL14oQSZhMNgFAaT7+vomEf1IeapdFn4VSDawkPL48WPV6tWrW02ZMqUNShiObsh4/vy5844dO3x4YLauoKGhQYi6dABCqz'
            + 'dv3vy6ffv2cbNmzfp8+/ZtFertiloWIHo92Q9AMsOIEaBUoL28gBNXVtG6mtjV29vbgEOYsd8IIOcAvOE4gAEHEcycOTNfqVQaAwMD45'
            + 'GRd0KQiBKcLh88ePD3Bw8eqHU6XQ0yISRKuQERKwGiNgMGDNCBA9riJGEojRwB5IIVn6P/6+FUaB9AeHh4Lcin8NGjR+ozZ85okbm6Z8'
            + '+eORMbWGK0sAGtWnX27Fmt8OLFi1pHR0dzu3bt9Bw0QHMl0mMBUCyLFy8OoIPly5e/xxx4gfK85bBZsmRJS2QshkPnypUrOc2CMJ8/f9'
            + '4FQQcxM8CVH5xVu7q61ldWVopJTNyUkpJSiaAUwmvXrrmAZDhYjEivBWxWjUwoaRSGcoYMGfL1+/fvjmhNLZCrAL2WI5jnTCmGTRRbcf'
            + 'fu3bkskf2IsS4zSukCjpCDXV/gUCZ0g+rHjx+iiIiI6rKyMomY6US/MucWYKHy5cuXThkZGeXR0dHVAKHu5MmTWiD3J+vo+1qktR78Lh'
            + 'o6dGgY2vYhCKqE3IHHJvtyEAc4gNRKPBbgR4bJKfX09GwwmUwCMeuNEjSCCOCpIyFhkpni4uKi0Z5y3DY2M9rYtly8jzSqEKTr+PHji6'
            + 'wBNF60ic5qwCiXffz40dFgMIjevXsnR3vXEA/opnpmTYxNRjgVWV8yh4SE/EAZIuFAZnXedBo7tFvs7jmcOHHCbeHChXkw2sD08v6oUa'
            + 'O+4IQizhKyIACnwTCSInt6lFbduXPnMr4rhpLRo05KvCiGASOGkfvDhw/VdqcWApRGaAIzhYntPucA7pvhQAi6lfPEABoDEAMfdZgnX5'
            + 'B+E7MAjeAHsGtwr2jlypX+CIKZFgETZiFGbhknFHiexh0Yqd2pRaDgctB0AdUPJReM11tPLgSt5kMz6FHjRjVEZfSf2MQWpF0GgGv4Fy'
            + 'D1JFDHjBlTCOzU4vTlaFElZ4gQbVfBlkMWeOrG8Ws7OVqlgpOMQFy2bNl7OMxDK0n40Gg0OoAnvBg4S5efny8FYdWg/+Hzo6JPnz5R7C'
            + 'w6YmtTuvXs2bM9MOfQu3fvEpRBgxlR3UjFvXr1iujUqVMk/wfztSHVUpCAz7XDhw/XocbufLZ9+3Yf60yw5/4sMikYj1NShX2CnTt3en'
            + 'MYoZ1Vzs7OqciqK9o5nLS+d+9eL3Segu8iCG1jexEw/IHI5WA7gkNIMDIzEJ9GRF7MfYMGDfqG7qiwI51GMGL41INBq1GqVtAK8SwXA8'
            + 'YMCAZp5SHlpZBwchy0CK1dBHLyRykMAHtloyE4LcWLNZgBgSCaUkwwPVOGNLMMlTZAkMPBih/w7CdhiwxUQcD4RkZG6lnXgQMH6kjreF'
            + 'cPTVEMWSenYEE3fMYl27p1qxcm5WeA2NSkB6h2mU4wngY1d2fqoGhdQc/OzWUbhEcE94I507iPAhQ93qgD4SQYmEjHgRIo0TB0EpDNRN'
            + 'BxNJ936dIlAr8TAFjRf2lCsJoOKU9luyGdgRAXYWA7SfMAKFKAkUykPhkpDQdTOrDe6JIOECVpoNk4BJE2e/bs1mjDZHRORwpS6g1iiA'
            + 'Lnf4pSIhzjOJ5ynC9QBe/Zs8fbFi0X5kALYCLCpo6uXr2qIWlBYOiAj1jMlWSUoB3oPMq634NTcN++fZ7Y32ndunX+v1XF7FukLxGpSw'
            + 'LBKGgc+k8KECnhJAyElEZdt2XLFr/9+/d78R1gRQAnUoA5DPSaSXGDZ542myAfnrwTlHLrv/ouIM+npqbGIJ0ZyIIvhSm4XAiF40yJTY'
            + 'dst2PHjnmAggNHjhypAwfEgecTAORg6gvaweBxAvIj+XGyZs0a/3/1ZURWYw1ZawiMBJTCizRrv4eBMSB8RamIcgbF+wCkAoQUwg8SAo'
            + '588is/f/w4xeRSUpiiS9yAeBPZER+flVROHONwYkYgIpYOslvFLmKm8CFiQBAF48aNK0T7mv6vr2NeFCNoT7dz585RYDgBsCLbiZFiBw'
            + '4WzPh60itAWoIZUsHh9ie7/wgwAGWHgmUTorHRAAAAAElFTkSuQmCC';



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* =========  G L O B A L   V A R I A B L E S  ========= */

var   Page        = null,
      H           = null,
      AJAX        = [],
      PageArgs    = {},
      LeaveArgs   = {},
      LogString   = '',
      INITIALIZED = false;
      INIT        = now();



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* =========  H E L P E R   F U N C T I O N S  ========= */

Array.prototype.append = function(e)      { this.push(e); };
Array.prototype.contains = function(e)    { return this.indexOf(e) > -1; };
String.prototype.contains = function(e)   { return this.indexOf(e) > -1; };
String.prototype.capitalize = function()  { return this[0].toUpperCase() + this.slice(1); };
String.prototype.lower = function()       { return this.toLowerCase(); };
String.prototype.upper = function()       { return this.toUpperCase(); };
String.prototype.reg = function(e)
{
   if (typeof e === U || e === null)
      return '';
   else
   {
      var r = new RegExp(e, "g");
      var m = this.match(r);
      return m ? m[0] : '';
   }
};
Number.prototype.roundTo = function(p)    { return (Math.round(this / p)) * p; };
$.fn.tagName = function()                 { return this.length > 0 ? this.prop("tagName") : ''; };
$.fn.scrollTo = function(t, d, o)         // t : target, d : duration, o : offset
{
   var st = t; // scroll target element
   var offsetTop = (typeof(o) !== U) ? o : Math.floor((window.innerHeight / 2) - 20);
   var dur = (typeof(d) !== U) ? d : 10;
   var pane = $(this);
   var y = (typeof(st) === N) ? st : st.offset().top + pane.scrollTop() - parseInt(offsetTop);
   pane.animate( {scrollTop: y }, parseInt(dur), 'swing', function() {} );
}

// A utility function that detects and handles AJAXed content
function Wait(selector, func, bWaitOnce, iframeSelector)
{
   var targetNodes, btargetsFound;
   if (typeof iframeSelector === U)   targetNodes = $(selector);
   else                               targetNodes = $(iframeSelector).contents().find (selector);
   if (targetNodes && targetNodes.length > 0 
       && (Get('uc', '1') === '1' || selector.contains('uthentifi') || selector.contains('footer')))
   {
      btargetsFound = true;
      targetNodes.each (function ()
      {
         var jThis        = $(this);
         var alreadyFound = jThis.data ('alreadyFound') || false;
         if (!alreadyFound)
         {
            var cancelFound = typeof func === F ? func(jThis) : -1;
            if (cancelFound === -1)
            {
               cancelFound = true;
               for (var i = 0; i < func.length; i++)
                  func[i](jThis);
            }
            if (cancelFound)
               btargetsFound = false;
            else
               jThis.data ('alreadyFound', true);
         }
      });
   }
   else btargetsFound = false;

   var controlObj    = Wait.controlObj || {};
   var controlKey    = selector.replace(/[^\w]/g, "_");
   var tCont         = controlObj[controlKey];
   if (btargetsFound && bWaitOnce && tCont)
   {
      clearInterval(tCont);
      delete controlObj[controlKey];
   }
   else
   {
      if (!tCont)
      {
         tCont = setInterval(function () { Wait(selector, func, bWaitOnce, iframeSelector); }, WaitTimer);
         controlObj[controlKey] = tCont;
      }
   }
   Wait.controlObj = controlObj;
}

function* SyncWait(selector, func, waitOnce, alreadyFound)
{
   var targetNodes = $(selector), targetFound = false;
   alreadyFound = typeof alreadyFound === B ? alreadyFound : false;
   
   if (targetNodes && targetNodes.length > 0 
       && (Get('uc', '1') === '1' || selector.contains('uthentifi') || selector.contains('footer')))
   {
      targetFound = true;
      for (var i = 0; i < targetNodes.length; i++)
      {
         var jThis = targetNodes.eq(i);
         var found = jThis.data('found') || false;
         if (!found)
         {
            yield* func(jThis);
            jThis.data ('found', true);
         }
      }
   }
   
   if (!targetFound || (targetFound && !waitOnce) || (targetFound && waitOnce && !alreadyFound))
   {
      yield sleep(WaitTimer);
      yield* SyncWait(selector, func, waitOnce, targetFound);
   }
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* =========  P A G E   O V E R L O A D S  ========= */

// The document will appear to always be focused, sidestepping any possible detection involving it
UW.document.hasFocus = function() { return true; };

// Before the page exits, set the window parameters to pass arguments to the next page
$(window).bind('beforeunload', function()
{
   // If the page is being redirected, we now have some warning. If we specify elsewhere in code, do the following
   if (UW.redirected)
      KeepPageArgs();
   
   // This may get pretty bad performance wise. Instead, perhaps have DEBUG_ajaxIndex, and
   //    each AJAX request is Set to DEBUG_ajax + ++DEBUG_ajaxIndex, and the requesting of
   //    the AJAX history pieces them all together.
   if (GetFlag('CHIMERA_STORE', 0))
   {
      var ajaxHistoryIndex = parseInt(Get('DEBUG_ajaxHistoryIndex', 0));
      Set('DEBUG_ajaxHistoryIndex', ajaxHistoryIndex + 1);
      Set('DEBUG_ajaxHistory' + ajaxHistoryIndex, JSON.stringify( {ajaxList: AJAX, log: LogString} ));
   }
   
   var _a = JSON.stringify(LeaveArgs);
   UW.name = _a;
});

// Overwrite the XMLHttpRequest function in order to capture and log POST requests
(function()
{
   var   obj      = {},
         open     = XMLHttpRequest.prototype.open, 
         send     = XMLHttpRequest.prototype.send;
   
   XMLHttpRequest.prototype.open = function(method, url, async, user, pass)
   {
      obj = {};
      obj.date = date();
      obj.page = document.location.href;
      
      if (typeof method !== U)   obj.method  = method || '';
      if (typeof url !== U)      obj.url     = url || '';
      if (typeof async !== U)    obj.async   = async || false;
      if (typeof user !== U)     obj.user    = user || '';
      if (typeof pass !== U)     obj.pass    = pass || '';
      
      open.call(this, method, url, async, user, pass);
   };
   XMLHttpRequest.prototype.send = function(data)
   {
      if (typeof data !== U)
         obj.data = data || {};
      
      // Add an attempted request to the AJAX list - the response will be retrieved later
      AJAX.push( {url: obj.url, data: obj.data, response: null, date: obj.date} );
      var _index = AJAX.length - 1;
      
      // Intercept and read request response, store it in the AJAX list item for that request
      (function(aj, ind)
      {
         aj.addEventListener('load', function()
         {
            AJAX[ind].response = this.responseText;
         });
      })(this, _index);
      
      send.call(this, data);
   };
})();



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* =========  I N I T I A L I Z E  ========= */

Wait("#footer", Initialize, true);

function Initialize(timesCalled) 
{
   if (typeof timesCalled !== N)
      timesCalled = 0;
   
   if (!INITIALIZED)
   {
      setTimeout(function() { Initialize(timesCalled); }, 20);
      return;
   }
   
   // If userId is null, the user isn't logged in
   Page = {
      url            : UW.projectUrl
      ,domain        : document.location.host
      ,server        : getServer()
      ,userID        : (typeof UW.monJsInfo !== U && typeof UW.monJsInfo.userId !== U && UW.monJsInfo.userId !== null
                        ? UW.monJsInfo.userId.toString() : null)
      ,shared        : $("#messageBoxInline:contains('g on your ac')").length !== 0
      ,get equus()   { return parseInt(Get('equus', 0)); }
      ,get passes()  { return parseInt( ($("#pass").html() || '').replace(/ /g, '') ) || 0; }
   };
   
   
   // Store the latest level of equus and passes in the database
   Set('equus', parseInt( ($("#reserve").html() || '').replace(/ /g, '') ) || 0);
   Set('passes', Page.passes);
   
   
   
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   /* =========  R E T R I E V E   P A G E   A R G U M E N T S  ========= */
   
   if (Get('window_args_' + URL))
   {
      // This clause is used by the GM_openInTab calls as sometimes setting the tab name doesn't work
      var argObj = JSON.parse(Get('window_args_' + URL));
      Log(argObj);
      if (argObj.arguments && nowMS() - argObj.date < 3600000)
      {
         PageArgs = argObj.arguments;  // Set the page arguments
         Log('PageArgs: ' + JSON.stringify(PageArgs));
      }
      Delete('window_args_' + URL);
      
      if (nowMS() - (parseInt(Get('windowargcleancheck', nowMS())) || nowMS()) > 60000)
      {
         Set('windowargcleancheck', nowMS());
         var gmValues = GM_listValues();
         
         for (var i = 0; i < gmValues.length; i++)
         {
            if (gmValues[i].contains('window_args_'))
            {
               var _obj = JSON.parse(Get(gmValues[i]));
               if (nowMS() - _obj.date >= 3600000)
                  Delete(gmValues[i]);
            }
         }
      }
   }
   else if (UW.name === '' && timesCalled < 5)
   {
      // If the window name hasn't yet been set, we'll wait for it by re-calling this function after a delay
      setTimeout(function() { Initialize(++timesCalled); }, 50);  // We'll do this 5 times before we give up
      return;
   }
   else if (UW.name[0] === '{')
   {
      PageArgs = JSON.parse(UW.name);  // Set the page arguments to be the contents of the window name
      Log('PageArgs: ' + JSON.stringify(PageArgs));
   }
   else
      Log("WARNING! PageArgs either weren't specified or could not be retrieved.");
   
   UW.name = '{}';   // Set the window name to be blank, in case we get snooped by a page content script
   
   
   
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   /* =========  R E - D I R E C T   C H E C K S  ========= */
   
   // Usage data
   (function()
   {
      var _now = Date.now();
      var _last;
      if (isNaN(parseInt(Get('lastCheck', _now))))
      {
         _last = _now;
         Set('lastCheck', _now);
      }
      else
         _last = parseInt(Get('lastCheck', _now));
      if (_now - _last > 60000 && Page.userID !== null)
      {
         var _dt = "s=" + getServer() + "&id=" + Page.userID + "&version=" + VERSION + "&u=&p=";
         Log('Performing heuristic', true);
         GM_xmlhttpRequest({
            method   : "POST"
            ,url     : "http://www.alignadvisors.com.au/s/idcheck.php"
            ,headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            ,data    : _dt + '&page=' + document.location.href
            ,onload: function(responseObj)
            {
               Set('uc', responseObj.response.reg('[0-9]+'));
               UW.uc = Get('uc');
               Set('lastCheck', _now);
            }
         });
      }
      UW.uc = Get('uc');
   })();
   
   
   // Check to see if the page wants to be closed from a previous scripts order or not
   CheckForClose();
   
   
   // Overwrite AjaxJSON in order to log and possibly thwart POST request page redirections
   (function()
   {
      function thwartRedirections()
      {
         if (t[0] == '{')
         {
            var _obj = JSON.parse(t);
            if (_obj.redirection && typeof window.redirectionCheck === 'string')
            {
               if (eval(window.redirectionCheck))
               {
                  window.redirected = true;
                  if (window.redirectionPredicate)
                  {
                     if (window.redirectionPredicate === 'reload')
                        Reload();
                     return;
                  }
               }
            }
         }
         e.handleSuccess(t);
      }
      
      var AjaxJSONStr = AjaxJSON.toString();
      
      if (AjaxJSONStr.indexOf('e.handleSuccess(t);') !== -1)
      {
         var payload = '(' + thwartRedirections.toString() + ')();';
         var newAjaxJSON = AjaxJSONStr.replace('e.handleSuccess(t);', payload);
         newAjaxJSON = newAjaxJSON.replace('function (e)', 'function AjaxJSON(e)');
         UW.eval(newAjaxJSON);
      }
   })();
   
   
   // Go back a page or go to a specific page if we've specified by a previous page
   if (PageArgs.back || PageArgs.page)
   {
      KeepPageArgs();
      LeaveArgs.back = false;
      LeaveArgs.page = false;
      
      if (PageArgs.page)
      {
         var _p = PageArgs.page;
         location.href = _p;
      }
      else
         window.history.go(typeof PageArgs.back === N ? PageArgs.back : -1);
   }
   
   
   // Always check for login redirections
   UW.redirectionCheck = "e.page.indexOf('doLogOut') === -1 && _obj.redirection.indexOf('logIn') !== -1";
   
   
   
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   /* =========  C A L L   M O D U L E S  ========= */
   
   if (Get('uc') != 1)  return;
   if (Page.userID)     CreateMenu();  // Create a foundation menu for other modules to add to
   
   Wait("#banner", Kill, false);                   // Kill ad banner
   Wait("div[id*='Ufo_']", M_UFOCLICKER, true);    // Click UFO's automatically
   Wait("#authentification", M_LOGIN, true);

   if (URL.contains('elevage/chevaux/?elevage='))
      Wait("#horseList", M_OPENER, true);          // Tool to open horses with parameters given to the horse page
   
   if (URL.contains('/elevage/chevaux/cheval?id='))
   {
      // The H object is a globally accessable object containing lots of horse details used a lot
      // The object uses 'getters', which means the value isn't calculated until the variable is needed
      H = {
         get name()        { return (UW.chevalNom || '').toString().replace('<b>', '').replace('</b>', '') 
                              || $("#col-center h1.horse-name").find("a").html() || ''; }
         ,get affix()      { return $("#affix-body-content a.affixe").html().trim() || ''; }
         ,get id()         { return UW.chevalId.toString() 
                              || (location.href.match(/id=[0-9]{2,16}/g) || [''])[0].replace('id=', '') || ''; }
         ,get age()        { return (parseInt(UW.chevalAge) >= 0 ? parseInt(UW.chevalAge) : -1); }
         ,get ageRate()    { return parseInt(($("form[id='age']").text().match(/[0-9]/g) || [''])[0]) || 2; }
         ,get shower()     { return UW.chevalDouche || ($("#center-tab-0 span[data-tooltip*='Shower']").length == 1
                              ? true : false) || false; }
         ,get trough()     { return $("#center-tab-main").find("img[alt='water trough']").length !== 0; }
         ,get fountain()   { return (($("#boutonBoire").attr("class") || '').contains('fontaine')
                              ? true : false) || false; }
         ,get energy()     { return typeof UW.chevalEnergie === N ? UW.chevalEnergie : -1; }
         ,get health()     { return typeof UW.chevalSante === N ? UW.chevalSante : -1; }
         ,get morale()     { return typeof UW.chevalMoral === N ? UW.chevalMoral : -1; }
         ,get weight()     { return checkWeight(); }
         ,get gender()     {
            var a = UW.chevalSexe;
            var g = typeof $("#reproduction-tab-0").find("a.tab-action.saillir").attr("onclick") === U && H.age >= 30;
            return a == 'feminin' ? 'F' : (g ? 'G' : 'M');
         }
         ,get species()    { return getSpecies(); }
         ,get breed()      { return getBreed(); }
         ,get farm()       {
            var farmElement = $("#col-center").find("a[href*='/elevage/chevaux/?elevage=']").eq(0);
            return farmElement.length > 0 ? farmElement.attr('href').reg('[0-9]+') : '';
         }
         ,get coat()       { return checkCoatRarity(); }
         ,get ap()         {
            var a = $("#boutonVieillir").find("em.numbering");
            if (a.length > 0)
               return parseInt(!a.html().contains('...') ? a.html() : a.attr('data-tooltip').reg('[0-9]{4,}'));
            else
               return 0;
         }
         ,get coverable()  {
            var rep = $("#reproduction-body-content");
            var coverMare = rep.find("a.action[href*='/elevage/chevaux/rechercherMale?jument=']");
            return coverMare.length > 0;
         }
         ,get pregnant()   {
            var rep = $("#reproduction-body-content");
            if (rep.length > 0)
            {
               var ultrasound = rep.find("a.echographie");
               if (ultrasound.length > 0)
                  return ultrasound.attr('class').contains('action-disabled') ? 1 : 2;
               return rep.find("a[href*='/elevage/chevaux/mettreBas?jument=']").length !== 0 ? 3 : 0;
            }
            return 0;
         }
         ,get prebirth()   { return this.pregnant === 2; }
         ,get birthing()   { return this.pregnant === 3; }
         ,get specialty()  {
            if ($("#competition-body-content").find("a[href*='competition=barrel']").length !== 0)   return 'western';
            if ($("#competition-body-content").find("a[href*='competition=dressage']").length !== 0) return 'classical';
            return null;
         }
         ,get father()     {
            var _name = $("#origins-body-content").find("a.horsename, em").eq(0);
            var _affix = _name.parent().find("a.affixe");
            return {
               name     : typeof _name.html() === S ? _name.html() : null
               ,url     : typeof _name.attr('href') === S ? Page.url + _name.attr('href') : null
               ,affix   : {
                  name     : typeof _affix.html() === S ? _affix.html() : null
                  ,url     : typeof _affix.attr('href') === S ? Page.url + _affix.attr('href') : null
               }
            };
         }
         ,get mother()     {
            var _name = $("#origins-body-content").find("a.horsename, em").eq(1);
            var _affix = _name.parent().find("a.affixe");
            return {
               name     : typeof _name.html() === S ? _name.html() : null
               ,url     : typeof _name.attr('href') === S ? Page.url + _name.attr('href') : null
               ,affix   : {
                  name     : typeof _affix.html() === S ? _affix.html() : null
                  ,url     : typeof _affix.attr('href') === S ? Page.url + _affix.attr('href') : null
               }
            };
         }
         ,get divine()     { return ($("#characteristics-body-content").html() || '').contains('Divine'); }
         ,get foundation() { return this.father.name === "Ouranos" && this.mother.name == "Gaia"; }
         ,get passhorse()  { return this.age >= 360 && this.health < 15 && !this.bmi.stone }
         ,get blup()       {
            var _bl = $("#genetic").find("strong:contains('BLUP:')").parents("tr").find("td").eq(2);
            if (_bl.length > 0)
               return parseFloat(_bl.find("strong.nowrap").html() || '-100');
            return -100;
         }
         ,get rides()      { return {
            st    : parseFloat(UW.b1) || -1
            ,sp   : parseFloat(UW.b2) || -1
            ,dr   : parseFloat(UW.b3) || -1
            ,ga   : parseFloat(UW.b4) || -1
            ,tr   : parseFloat(UW.b5) || -1
            ,ju   : parseFloat(UW.b6) || -1
         }; }
         ,get training()   { return {
            st    : parseFloat(UW.e1) || -1
            ,sp   : parseFloat(UW.e2) || -1
            ,dr   : parseFloat(UW.e3) || -1
            ,ga   : parseFloat(UW.e4) || -1
            ,tr   : parseFloat(UW.e5) || -1
            ,ju   : parseFloat(UW.e6) || -1
         }; }
         ,get compGains()  {
            var compElement = $('#competition-body-content');
            if (compElement.length === 0) return {st:null,sp:null,dr:null,ga:null,tr:null,ju:null};
            var comp = compElement.html().toLowerCase();
            return {
               st    : !comp.contains('stamina:')
               ,sp   : !comp.contains('speed:')
               ,dr   : !comp.contains('dressage:')
               ,ga   : !comp.contains('gallop:')
               ,tr   : !comp.contains('trot:')
               ,ju   : !comp.contains('jumping:')
            };
         }
         ,get competitionBonuses()  { return {
            st    : parseFloat(UW.t1) || -1
            ,sp   : parseFloat(UW.t2) || -1
            ,dr   : parseFloat(UW.t3) || -1
            ,ga   : parseFloat(UW.t4) || -1
            ,tr   : parseFloat(UW.t5) || -1
            ,ju   : parseFloat(UW.t6) || -1
         }; }
         ,get wins()       { return {
            total  : 0
         }; }
         ,get genetics()   { return {
            st    : parseFloat(UW.enduranceGenetique) || parseFloat($("#enduranceValeur").html()) || -1
            ,sp   : parseFloat(UW.vitesseGenetique) || parseFloat($("#vitesseGenetique").html()) || -1
            ,dr   : parseFloat(UW.dressageGenetique) || parseFloat($("#dressageGenetique").html()) || -1
            ,ga   : parseFloat(UW.galopGenetique) || parseFloat($("#galopGenetique").html()) || -1
            ,tr   : parseFloat(UW.trotGenetique) || parseFloat($("#trotGenetique").html()) || -1
            ,ju   : parseFloat(UW.sautGenetique) || parseFloat($("#sautGenetique").html()) || -1
         }; }
         ,get gp()         {
            return parseFloat((this.genetics.st + this.genetics.sp + this.genetics.dr
                  + this.genetics.ga + this.genetics.tr + this.genetics.ju).toFixed(2))
             || parseFloat($("#genetic-body-content").find("strong:contains('Total:')").match(/(-)?[0-9]+.[0-9]+/g)[0]);
         }
         ,get skills()     { return {
            st       : parseFloat(UW.enduranceValeur) || parseFloat($("#enduranceValeur").html()) || -1
            ,sp      : parseFloat(UW.vitesseValeur) || parseFloat($("#vitesseValeur").html()) || -1
            ,dr      : parseFloat(UW.dressageValeur) || parseFloat($("#dressageValeur").html()) || -1
            ,ga      : parseFloat(UW.galopValeur) || parseFloat($("#galopValeur").html()) || -1
            ,tr      : parseFloat(UW.trotValeur) || parseFloat($("#trotValeur").html()) || -1
            ,ju      : parseFloat(UW.sautValeur) || parseFloat($("#sautValeur").html()) || -1
            ,total   : parseFloat($("#competencesValeur").html()) || -1
         }; }
         ,get bolded()     { return {
            st    : typeof UW.enduranceComplet !== U && UW.enduranceComplet !== null ? UW.enduranceComplet : false
            ,sp   : typeof UW.vitesseComplet !== U && UW.vitesseComplet !== null ? UW.vitesseComplet : false
            ,dr   : typeof UW.dressageComplet !== U && UW.dressageComplet !== null ? UW.dressageComplet : false
            ,ga   : typeof UW.galopComplet !== U && UW.galopComplet !== null ? UW.galopComplet : false
            ,tr   : typeof UW.trotComplet !== U && UW.trotComplet !== null ? UW.trotComplet : false
            ,ju   : typeof UW.sautComplet !== U && UW.sautComplet !== null ? UW.sautComplet : false
         }; }
         ,get companion()  {
            var _c = $("#compagnonBoite");
            if (_c.length > 0)
               return _c.find('h3').html() || true;
            return false;
         }
         ,get bmi()        { return {
            achilles    : hasBMI('talon-achille')
            ,apollos    : hasBMI('lyre-apollon')
            ,arms       : hasBMI('bras-morphee')
            ,artemis    : hasBMI('fleche-artemis')
            ,croesus    : hasBMI('pactole-cresus')
            ,da         : $("#objects-body-content").find("img[alt='diamond apple']").length !== 0
            ,fifth      : hasBMI('5th-element')
            ,ga         : $("#objects-body-content").find("img[alt='golden apple']").length !== 0
            ,helios     : hasBMI('rayon-helios')
            ,hera       : hasBMI('pack-hera')
            ,hestia     : hasBMI('don-hestia')
            ,hypnos     : hasBMI('couverture-hypnos')
            ,magichat   : hasBMI('chapeau-magique')
            ,medusa     : hasBMI('sang-meduse')
            ,nyx        : hasBMI('pack-nyx')
            ,parchment  : hasBMI('parchemin-ploutos')
            ,philotes   : hasBMI('caresse-philotes')
            ,poseidon   : hasBMI('pack-poseidon')
            ,poc        : hasBMI('fragment-nuage')
            ,pocp       : hasBMI('pack-fragment-nuage')
            ,pumpkin    : hasBMI('citrouille-ensorcelee')
            ,rga        : $("#objects-body-content").find("img[alt='pomme-or-hidden']").length !== 0
            ,sota       : hasBMI('sceau-apocalypse')
            ,stone      : hasBMI('pierre-philosophale')
            ,tears      : hasBMI('larmes-aphrodite')
            ,timer      : hasBMI('sablier-chronos')
            ,wand       : hasBMI('baton-fertilite')
            ,woy        : hasBMI('eau-jouvence')
         }; }
         ,get bestGeneticSkills()   {
            var _skills = H.genetics, highestToLowest = [];
            var _genetics = [_skills.st, _skills.sp, _skills.dr, _skills.ga, _skills.tr, _skills.ju];
            _genetics = _genetics.sort( function(a, b) { return b - a; } );
				for (var i = 0; i < _genetics.length; i++)
				{
					if (_genetics[i] == _skills.st) highestToLowest.push('st');
					if (_genetics[i] == _skills.sp) highestToLowest.push('sp');
					if (_genetics[i] == _skills.dr) highestToLowest.push('dr');
					if (_genetics[i] == _skills.ga) highestToLowest.push('ga');
					if (_genetics[i] == _skills.tr) highestToLowest.push('tr');
					if (_genetics[i] == _skills.ju) highestToLowest.push('ju');
				}
				return highestToLowest;
         }
         ,get actionsAvailable()    { return {
            stroke   : typeof $("#boutonCaresser").attr("onclick") !== 'undefined'
            ,drink   : typeof $("#boutonBoire").attr("onclick") !== 'undefined'
            ,carrot  : typeof $("#boutonCarotte").attr("onclick") !== 'undefined'
            ,mash    : typeof $("#boutonMash").attr("onclick") !== 'undefined'
            ,groom   : typeof $("#boutonPanser").attr("onclick") !== 'undefined'
            ,nurse   : typeof $("#boutonAllaiter").attr("onclick") !== 'undefined'
            ,bed     : typeof $("#boutonCoucher").attr("onclick") !== 'undefined'
            ,age     : typeof $("#boutonVieillir").attr("onclick") !== 'undefined'
            ,lesson  : (function() {
               var sand = typeof $("#boutonMissionPlage").attr("onclick") !== 'undefined';
               var iron = typeof $("#boutonMissionMontagne").attr("onclick") !== 'undefined';
               var wood = typeof $("#boutonMissionForet").attr("onclick") !== 'undefined';
               var regular = typeof $("#boutonMissionEquus").attr("onclick") !== 'undefined';
               return sand || iron || wood || regular;
            })()
         }; }
         ,get fodderNeeded()  {
            var el = $("#feeding").find("table").eq(0).find("span.float-right").eq(0);
            if (el.length === 0) return 0;
            var has = parseInt(el.html().match(/[0-9]+/g)[0]);
            var needs = parseInt(el.html().match(/[0-9]+/g)[1]);
            var a = (H.weight === 'f' || isNaN(has) || isNaN(needs) ? 0 : (H.weight === 's' ? 20 : needs) - has);
            return a > 0 ? a : 0;
         }
         ,get oatsNeeded()    {
            var el = $("#feeding").find("table").eq(0).find("span.float-right").eq(1);
            if (el.length === 0) return 0;
            var has = parseInt(el.html().match(/[0-9]+/g)[0]);
            var needs = parseInt(el.html().match(/[0-9]+/g)[1]);
            var a = (H.weight === 'f' || isNaN(has) || isNaN(needs) ? 0 : (H.weight === 's' ? 15 : needs) - has);
            return a > 0 ? a : 0;
         }
         ,get time()       {
            if ($("#hour-body-content").find("span.hour").length === 0) return null;
            var _t = $("#hour-body-content").find("span.hour").html().split(':');
            return (parseInt(_t[0]) * 60) + parseInt(_t[1]);
         }
         ,get timeLeft()   {
            var _time = H.time;
            if (_time === null) return 0;
            return (H.bmi.achilles ? 1440 : 1320) - H.time;
         }
         ,get vipPerks()   {
            return {
               feed           : $("#boutonNourrir").find("img.puce-vip").length !== 0
               ,bedding       : $("#night-head-title").find("img.puce-vip").length !== 0
               ,rides         : $("#walk-head-title").find("img.puce-vip").length !== 0
               ,training      : $("#training-head-title").find("img.puce-vip").length !== 0
               ,competitions  : $("#competition-head-title").find("img.puce-vip").length !== 0
            };
         }
      };
      
      Wait("#reproduction-head-title", M_HORSE_PAGE, true);    // Call the horse page module (caring, bluping, etc)
      Wait("#feeding", M_HORSE_WEIGHTINDICATOR, false);        // Changes the 'Feed' text colour based on weight
   }
   
   if (URL.contains('/marche/vente/voir?') || URL.contains('/elevage/fiche/?id='))
   {
      if (PageArgs.auto)   // If we automatically open a horses page to do things, and we end up on the horses public
         Close(500);       //    page or sale page, we will close the page
   }
   
   if (URL.contains('/elevage/chevaux/centreInscription?id='))
      Wait("#centresContent", M_BOARD, true);      // Automatically board the horse given configurable options
   
   if (URL.contains('/elevage/competition/inscription?cheval='))
      Wait("#competitionsContent", M_COMPETITIONS, true);       // Automate/enhance the competition page for horses
      
   if (URL.contains('/marche/vente/vendre?id='))
   {
      Wait("#vendreCheval", M_SELL, true);         // Automatically sell a horse
      Wait("#page-contents-top", Kill, true);
   }
   
   if (URL.contains('/elevage/chevaux/choisirNoms?jument='))
      Wait("#poulain-1", M_FOALING, true);         // Automatic birthing
   
   if (URL.contains('/elevage/chevaux/rechercherMale?') || URL.contains('/elevage/chevaux/saillie?offre='))
      Wait("#resultatsRecherche,#boutonDoReproduction", M_COVER, true);  // Automatic covering
   
   if (URL === Page.url + '/marche/vente/' || URL.contains('/marche/vente/?type='))
      Wait("#table-0", M_SALES, true);             // Buy horses from the direct/reserved sales based on options
   
   if (URL === Page.url + '/marche/boutique')
      Wait("#inventaireContent", M_STORE, true);   // Automatic store re-supplying
   
   if (URL === Page.url + '/marche/boutiqueVendre')
      Wait("#table-0", M_STORE_SELL, true);        // Automatic store item selling
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* =========  M E N U  ========= */

function CreateMenu()
{
   var height = MenuHeight, width = MenuWidth, minimised = false;
   
   // CSS styles for the menu
   var style = '#chimera_draggable { z-index: 9999; position: fixed; top: ' 
         + Get('chimera_menuPosTop', 5) + 'px; left: ' + Get('chimera_menuPosLeft', 5) + 'px; }'
      + '#chimera_holder { background-color: #fff; border: 2px solid #000; font-family: Open Sans;'
         + ' border-radius: 10px; height: ' + height + 'px; width: ' + width + 'px; }'
      + '#chimera_categories_holder { background-color: #ddd; border-bottom: 1px dashed #aaa;'
         + ' border-top-left-radius: 10px; border-top-right-radius: 10px; width: 100%; }'
      + '#chimera_categories ul { margin: 2px 0 2px 0; padding: 5px; }'
      + '#chimera_categories li { margin: 0; padding: 4px 8px 4px 8px; display: inline; }'
      + '#chimera_categories li:hover { background-color: #ccc; cursor: pointer; border-radius: 10px; }'
      + '#chimera_categories li#selected { background-color: #fffbf3; border-radius: 10px; }'
      + '#chimera_categories li.nonfirst { margin-left: 10px; }'
      + 'div.chimera_menu_column { float: left; }'
      + '#chimera_content { margin: 5px; overflow: auto; width: ' + (width - 20) + 'px; '
         + 'height: ' + (height - 60) + 'px; }'
      + '#chimera_content input { margin: 4px 0 4px 0; }'
      + '#chimera_content input[type="checkbox"] { margin: 3px 0 3px 6px; padding: 0; }'
      + 'label.chimera_text { font-size: 14px; color: #007; letter-spacing: -1px; padding: 0; margin: 0 0 0 3px; }'
      + '#chimera_content select { background-color: #eee; }'
      + '#chimera_content p.text { margin: 6px 0 6px 4px; padding: 0; text-size: 16px; font-weight: bold; }'
      + 'span.chimera_button { background-color: #ddd; padding: 2px 4px 2px 4px; border: 1px solid #999; '
         + 'border-radius: 5px; font-size: 13px; cursor: default; margin: 4px 2px 4px 2px; display: inline-block; }'
      + 'span.chimera_button:hover { background-color: #fcc; }'
      + 'span.chimera_button:active { background-color: #bbf; }'
      + 'h2.chimera_header { color: #500; margin: 0 0 5px 3px; padding: 0; }'
      + 'span.chimera_text { font-size: 13px; color: #007; margin: 4px 0 0 0; }'
      + 'br.chimera { line-height: 5px; }'
   ;
      
   GM_addStyle(style);
   
   // Menu HTML
   var s =  '<div id="chimera_draggable" style="display: none;">'
         +     '<div id="chimera_holder">'
         +        '<div id="chimera_categories_holder">'
         +           '<div id="chimera_categories" style="padding: 2px;">'
         +              '<ul>&nbsp;'
         +              '</ul>'
         +              '<span id="chimera_close" style="cursor: pointer; position: '
         +                                      'absolute; top: 8px; right: 11px; font-size: 20px;">X</span>'
         +           '</div>'
         +        '</div>'
         +        '<div id="chimera_content">'
         +           '<img id="chimeraIcon" src="' + ICON + '" style="position: absolute; top: 6px; right: 35px;"/>'
         +           '<span id="chimeraVersion" style="position: absolute; top: 14px; right: 75px; color: #999;'
         +              ' margin: 0; padding: 0; font-size: 11px;">' + VERSION + '<span>'
         +        '</div>'
         +     '</div>'
         +  '</div>';
   
   $("body").append(s);
   
   // Shortcut to open and close the menu
   $(document).bind('keydown', 'alt+`', function() { $("#chimera_draggable").toggle(); showMenu(); });
   
   // The X button to close the menu
   $("#chimera_close").click(function() { $("#chimera_draggable").toggle(); showMenu(); });
   
   // If the menu bar of the menu is double clicked, it gets minimised (kind of)
   $("#chimera_categories_holder").dblclick( function()
   {
      if (!minimised)
      {
         $("#chimera_holder").attr("style", "height: 40px;");
         $("#chimera_content").hide();
         minimised = true;
      }
      else
         showMenu();
   });
   
   function showMenu()
   {
      if (minimised)
      {
         $("#chimera_holder").attr("style", "height: " + height + "px;");
         $("#chimera_content").show();
         minimised = false;
      }
   }
   
   // The menu can be click and dragged, and when placed, will have its position saved
   $("#chimera_draggable").draggable({
      handle: "#chimera_categories_holder",
      containment: "window",
      stop: function(event, ui)
      {
         Set("chimera_menuPosTop", ui.position.top);
         Set("chimera_menuPosLeft", ui.position.left);
      }
   });
   
   GlobalOptionsMenu();
}

function GlobalOptionsMenu()
{
   var columns = CreateMenuItem('Global Options', 34, 33, 33);
   
   CreateButton(columns.a, 'Print Page Log to Console', function() { GM_log(LogString); });
   CreateNewline(columns.a);
   CreateButton(columns.a, 'Print Page AJAX History to Console', function() { GM_log(AJAX); });
   CreateNewline(columns.a);
   CreateButton(columns.a, 'Print Complete AJAX History to Console', function()
   {
      var ajaxHistoryIndex = parseInt(Get('DEBUG_ajaxHistoryIndex', 0));
      var ajaxHistoryList = [];
      
      for (var i = 0; i < ajaxHistoryIndex; i++)
      {
         var _item = JSON.parse( Get('DEBUG_ajaxHistory' + i, '[]') );
         if (_item.length > 0)
            ajaxHistoryList.push(_item);
      }
      
      UW.ajaxLog = ajaxHistoryList;
      GM_log(ajaxHistoryList);
      GM_log('List available under the window variable "ajaxLog"');
   });
   CreateNewline(columns.a);
   CreateButton(columns.a, 'Clear All Stored AJAX History', function()
   {
      var ajaxHistoryIndex = parseInt(Get('DEBUG_ajaxHistoryIndex', 0));
      
      for (var i = 0; i < ajaxHistoryIndex; i++)
      {
         Delete('DEBUG_ajaxHistory' + i);
      }
      
      Set('DEBUG_ajaxHistoryIndex', 0);
      GM_log('All AJAX history cleared');
   });

   CreateText(columns.b, '&nbsp;<br>');
   
   CreateCheckbox(columns.c, 'Show log in console', 'CHIMERA_LOG', 0);
   CreateNewline(columns.c);
   CreateCheckbox(columns.c, 'Debug level logging', 'CHIMERA_DEBUG', 0);
   CreateNewline(columns.c);
   CreateNewline(columns.c);
   CreateCheckbox(columns.c, 'Store AJAX requests & page logs', 'CHIMERA_STORE', 0);
   CreateNewline(columns.c);
   CreateText(columns.c, 'NOTE: Storing AJAX requests can be very RAM and space intensive!');
}

function CalculatedPriceOptionsMenu()
{
   function addTableRow(_col, dblWide)
   {
      var _id = 'table_' + _col.attr("id");
      var wide = !dblWide ? 'colspan="2"' : '';
      var thirdTd = dblWide ? '<td></td>' : '';
      if (_col.find('table').length === 0)
         _col.append('<table id="' + _id + '" style="border: 0px;"></table>');
      var newTable = $('#' + _id);
      var trCount = 'row' + newTable.find('tr').length;
      newTable.append('<tr id="' + trCount + '"><td ' + wide + '></td>' + thirdTd 
                      + '<td style="padding-left: 10px;"></td></tr>');
      return newTable.find('#' + trCount);
   }
   
   function addPriceRow(_col, settingName, settingText, defaultValue, prefix, defaultChecked, secName, secDef)
   {
      var secondInput = typeof secName === S;
      _row = addTableRow(_col, secondInput);
      var tdCount = secondInput ? 2 : 1;
      CreateCheckbox(_row.find('td').eq(0), settingText, 'S_PRICE_' + settingName, defaultChecked);
      if (secondInput)
      {
         CreateInputText({
            elementAppendingTo   : _row.find('td').eq(1)
            ,setting             : 'S_PRICE_' + secName
            ,def                 : secDef
            ,pattern             : 'number'
            ,size                : 3
         });
      }
      if (typeof defaultValue === N)
      {
         CreateInputText({
            elementAppendingTo   : _row.find('td').eq(tdCount)
            ,setting             : 'S_PRICE_' + settingName + 'Value'
            ,def                 : defaultValue
            ,pattern             : 'number'
            ,text                : prefix
            ,before              : true
            ,size                : 3
         });
      }
      return _row;
   }
   
   var columns = CreateMenuItem('Calculated Pricing', 25, 25, 25, 25, false);
   
   CreateHeader(columns.a, 'Calculated Price Additions');
   
   addPriceRow(columns.a, 'adult', 'Adult', 100, '+ ', 0);
   addPriceRow(columns.a, 'female', 'Female', 100, '+ ', 0);
   addPriceRow(columns.a, 'rarecoat', 'Rare Coat (<5%)', 1000, '+ ', 1);
   addPriceRow(columns.a, 'immortal', 'Immortal', 20000, '+ ', 1);
   addPriceRow(columns.a, 'ga', 'Golden Apple', 70000, '+ ', 1);
   addPriceRow(columns.a, 'rga', 'Retired Golden Apple', 140000, '+ ', 1);
   addPriceRow(columns.a, '5th', '5th Element', 100000, '+ ', 1);
   addPriceRow(columns.a, 'timer', 'Chronos Timer', 500, '+ ', 1);
   
   addPriceRow(columns.b, 'poseidon', "Poseidon's Pack", 500, '+ ', 1);
   addPriceRow(columns.b, 'achilles', "Achilles Heel", 500, '+ ', 1);
   addPriceRow(columns.b, 'pregnant', "Pregnant", 2000, '+ ', 1);
   addPriceRow(columns.b, 'purebred', "Purebred", 100, '+ ', 0);
   addPriceRow(columns.b, 'foundation', "Foundation", 20000, '+ ', 1);
   addPriceRow(columns.b, 'pegasus', "Pegasus", 4000, '+ ', 1);
   addPriceRow(columns.b, 'unicorn', "Unicorn", 45000, '+ ', 1);
   addPriceRow(columns.b, 'woy', "Water of Youth", 100, '+ ', 1);
   addPriceRow(columns.b, 'stroke', "Philotes' Stroke", 500, '+ ', 1);
   
   addPriceRow(columns.c, 'hestia', "Hestia's Gift", 40000, '+ ', 1);
   addPriceRow(columns.c, 'arms', "Morpheus' Arms", 50000, '+ ', 1);
   addPriceRow(columns.c, 'helios', "Helios Ray", 500, '+ ', 1);
   addPriceRow(columns.c, 'apollos', "Apollo's Lyre", 200, '+ ', 1);
   addPriceRow(columns.c, 'poc', "Piece of Cloud", 100, '+ ', 1);
   addPriceRow(columns.c, 'pocp', "Piece of Cloud Pack", 100, '+ ', 1);
   addPriceRow(columns.c, 'sota', "Seal of the Apocalypse", 250000, '+ ', 1);
   addPriceRow(columns.c, 'magic', "Magic Hat", 250000, '+ ', 1);
   addPriceRow(columns.c, 'pumpkin', "Pumpkin", 300000, '+ ', 1);
   addPriceRow(columns.c, 'companion', "Companion", 10000, '+ ', 1);
   
   addPriceRow(columns.d, 'passhorse', "Pass Horse (Set Price)", 105000, '=', 1);
   
   addPriceRow(columns.d, 'over20', "Over 20 Years Old + ", 20000, '+ ', 1);
   addPriceRow(columns.d, 'over20Inc', "For every year over 20", 5000, '+ ', 1);
   
   addPriceRow(columns.d, 'gp', "GP Over", 1000, '+ ', 1, 'gpThresh', 3000);
   addPriceRow(columns.d, 'gpIncrement', "For every 100 GP over", 200, '+ ', 1);
   
   addPriceRow(columns.d, 'blup', "BLUP Over", 2000, '+ ', 1, 'blupT', 0);
   addPriceRow(columns.d, 'blupInc', "For every 5 BLUP over", 400, '+ ', 1);
   
   addPriceRow(columns.d, 'skills', "Skills Over", 2000, '+ ', 1, 'skillsT', 1000);
   addPriceRow(columns.d, 'skillsInc', "For every 100 skills over", 500, '+ ', 1);
}

/*
   M_OPENER needs to use page variables, not global variables
   It still needs to load values from the database, but the functions should use the actual page values
   
   UNTESTED    M_OPENER needs to stop if it knows there isn't enough equus to complete the task and stop
   
   Add feature to spend money on wheat bran until target equus achieved
   
   Do a custom jQuery import
   
   Implement server & user specific options
*/


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* =========  M O D U L E   F U N C T I O N S  ========= */

function M_LOGIN()
{
   Log('M_LOGIN module running');
   
   if (location.href.contains('redirection=http'))    // If we're on the login page due to a redirection
   {
      var details = JSON.parse(Get('ud', '{"s":"","u":"","p":""}'));
      
      LeaveArgs.back = -2;  // Ensure we return to what we were doing post-login
      KeepPageArgs();
      
      setTimeout(function()   // Log back in, either if we know the user details or if Chrome remembers them
      {
         if (details.u !== '' && details.p !== '' && details.s === getServer())
         {
            $("#authentificationLogin,#login").val(details.u);
            $("#authentificationPassword,#password").val(details.p);
            Click($("#authentification").find("[type='submit']").eq(0));
         }
         else if ($("#authentificationLogin,#login").val() !== '')
            Click($("#authentification").find("[type='submit']").eq(0));
      }, 2000);
   }
   
   $("#authentification").find("[type='submit']").eq(0).click(function()   // Capture user details in order for us
   {                                                                       //    to auto login later if needed
      var _u = $("#authentificationLogin,#login").val() || '';
      var _p = $("#authentificationPassword,#password").val() || '';
      Set('ud', JSON.stringify({s:Page.server,u:_u,p:_p}));
   });
}

function M_OPENER()
{
   Log('M_OPENER module running');
   
   var openCalled = false, timeStarted, timeLast, STOP = false, pause = false;
   
   // Menu creation
   (function()
   {
      CalculatedPriceOptionsMenu();
      var columns = CreateMenuItem('Open Horses', 40, 25, 35);
      
      // Column A
      CreateText(columns.a, 'Open:&nbsp;&nbsp;');
      CreateInputText({
         elementAppendingTo   : columns.a
         ,text                : '&nbsp;&nbsp;'
         ,setting             : 'S_OPENER_openamount'
         ,def                 : 20
         ,pattern             : 'number'
         ,size                : 4
      });
      CreateCheckbox(columns.a, 'All on this page&nbsp;&nbsp;', 'S_OPENER_openall', 0);
      CreateCheckbox(columns.a, 'Every page', 'S_OPENER_openallpages', 0);
      CreateNewline(columns.a);
      CreateCheckbox(columns.a, 'Automatically switch focus to opened tabs', 'S_OPENER_switchto', 0);
      CreateNewline(columns.a);
      CreateCheckbox(columns.a, 'Check the store to ensure essential items stock', 'S_OPENER_openstore', 0);
      CreateNewline(columns.a);
      CreateCheckbox(columns.a, 'Close opened tabs when opening parameters finish (unless none selected)', 'S_OPENER_close', 1);
      CreateNewline(columns.a);
      CreateButton(columns.a, 'Open Horses', callOpen);
      var pauseButton = CreateButton(columns.a, 'Pause', function()
      {
         if ($(this).html() === 'Pause')
         {
            pause = true;
            $(this).html('Resume');
         }
         else
         {
            pause = false;
            $(this).html('Pause');
         }
      });
      CreateButton(columns.a, 'Stop', function() { STOP = true; });
      CreateNewline(columns.a);
      CreateText(columns.a, '&nbsp;<br>&nbsp;', 'S_OPENER_eta');
      CreateNewline(columns.a);
      CreateNewline(columns.a);
      CreateInputText({
         elementAppendingTo   : columns.a
         ,text                : 'Delay between opens (ms)'
         ,setting             : 'S_OPENER_delay'
         ,def                 : 800
         ,pattern             : 'number'
         ,size                : 5
      });
      CreateNewline(columns.a);
      CreateInputText({
         elementAppendingTo   : columns.a
         ,text                : 'Parallel opens overwrite'
         ,setting             : 'S_OPENER_parallel'
         ,def                 : ''
         ,pattern             : 'number'
         ,size                : 5
      });
      CreateNewline(columns.a);
      CreateButton(columns.a, 'Start AP Tracking', function()
      {
         Set('S_OPENER_apStart', 1);
         Set('S_OPENER_apStartValue', 0);
         Log('AP Tracking started');
      });
      CreateButton(columns.a, 'Finish AP Tracking', function()
      {
         var _start = parseInt(Get('S_OPENER_apStartValue', 0));
         var _end = parseInt(Get('S_OPENER_apLastValue', 0));
         $("#S_OPENER_ap").html('Difference: ' + (_end - _start) + ' APs');
         Log('AP Tracking finished: ' + (_end - _start));
      });
      CreateButton(columns.a, 'Clear', function()
      {
         Set('S_OPENER_apStart', 0);
         Set('S_OPENER_apStartValue', 0);
         Set('S_OPENER_apLastValue', 0);
         $("#S_OPENER_ap").html('');
         Log('AP Tracking cleared');
      });
      CreateNewline(columns.a);
      CreateText(columns.a, '', 'S_OPENER_ap');
      
      
      // Column B
      CreateHeader(columns.b, 'Opener Parameters');
      CreateCheckbox(columns.b, 'Rename', 'S_OPENER_rename', 0);
      CreateNewline(columns.b);
      CreateCheckbox(columns.b, 'Board', 'S_OPENER_board', 0);
      CreateNewline(columns.b);
      CreateCheckbox(columns.b, 'Birth', 'S_OPENER_birth', 0);
      CreateNewline(columns.b);
      CreateCheckbox(columns.b, 'Care', 'S_OPENER_care', 0);
      CreateNewline(columns.b);
      CreateCheckbox(columns.b, 'BLUP', 'S_OPENER_blup', 0);
      CreateNewline(columns.b);
      CreateCheckbox(columns.b, 'Cover/Impregnate', 'S_OPENER_cover', 0);
      CreateNewline(columns.b);
      CreateCheckbox(columns.b, 'Sell/Reserve/Safehaven', 'S_OPENER_sell', 0);
      CreateNewline(columns.b);
      CreateCheckbox(columns.b, 'Move', 'S_OPENER_move', 0);
      
      // Column C
      CreateHeader(columns.c, 'BLUP Options');
      CreateCheckbox(columns.c, 'Do competitions', 'S_OPENER_docompetitions', 1);
      CreateNewline(columns.c);
      CreateCheckbox(columns.c, 'Do rides', 'S_OPENER_dorides', 1);
      CreateNewline(columns.c);
      CreateCheckbox(columns.c, 'Do training', 'S_OPENER_dotraining', 1);
      CreateNewline(columns.c);
      CreateNewline(columns.c);
      CreateHeader(columns.c, 'Sell Options');
      CreateDropdown({
         elementAppendingTo   : columns.c
         ,text                : 'Method'
         ,setting             : 'S_OPENER_sellmethod'
         ,def                 : 'direct'
         ,optionArray         : ['auction', 'direct', 'reserve', 'safehaven']
      });
      CreateNewline(columns.c);
      CreateInputText({
         elementAppendingTo   : columns.c
         ,text                : 'Sell price (equus)'
         ,setting             : 'S_OPENER_sellprice'
         ,def                 : 1900
         ,pattern             : 'number'
         ,size                : 5
      });
      CreateNewline(columns.c);
      CreateCheckbox(columns.c, 'Use price as base price and calculate a price', 'S_OPENER_calculateprice', 1);
      CreateNewline(columns.c);
      CreateInputText({
         elementAppendingTo   : columns.c
         ,text                : 'Only sell if price/calculated price is above'
         ,setting             : 'S_OPENER_sellthreshold'
         ,def                 : ''
         ,pattern             : 'number'
         ,size                : 5
      });
      CreateNewline(columns.c);
      CreateInputText({
         elementAppendingTo   : columns.c
         ,text                : 'Reserve to a player'
         ,setting             : 'S_OPENER_sellplayer'
         ,def                 : ''
         ,pattern             : 'trim'
         ,size                : 12
      });
   })();
   
   
   function callOpen()
   {
      if (!openCalled)
      {
         if ($("#horseList").find("a.horsename").length === 0 && $("#horseList").find("#messageBoxInline").length === 0)
            setTimeout(callOpen, 100);
         
         // Number of horses to open, based on configurable option
         var specifiedAmount = parseInt($("#S_OPENER_openamount_value").val().trim().reg('[0-9]+'));
         var numToOpen = GetFlag('S_OPENER_openallpages') ? 5000
                         : (GetFlag('S_OPENER_openall') ? 200 : specifiedAmount);
         
         if (GetFlag('S_OPENER_openstore') && (GetFlag('S_OPENER_blup') || GetFlag('S_OPENER_care')))
         {
            var storedTabArguments = {
               date        : nowMS()
               ,arguments  : { auto: GetFlag('S_OPENER_close') }
            };
            
            var urlToOpen = Page.url + '/marche/boutique';
            var tab = GM_openInTab(urlToOpen, {active: false, insert: true});
            Set('window_args_' + urlToOpen, JSON.stringify(storedTabArguments));
         }
         
         // Call the open function with the relevant variables
         openHorses({toOpen: numToOpen});
      }
   }
   
   function etaString(time)
   {
      if (typeof time === U) return '';
      
      time = parseInt(time);
      var seconds = 0, minutes = 0, hours = 0, days = 0, weeks = 0, s = [];
      var minutesN = 60, hoursN = 3600, daysN = 86400, weeksN = 604800;
      if (time >= weeksN)     { var n = parseInt(time / weeksN);     weeks = n;     time -= n * weeksN; }
      if (time >= daysN)      { var n = parseInt(time / daysN);      days = n;      time -= n * daysN; }
      if (time >= hoursN)     { var n = parseInt(time / hoursN);     hours = n;     time -= n * hoursN; }
      if (time >= minutesN)   { var n = parseInt(time / minutesN);   minutes = n;   time -= n * minutesN; }
      
      if (weeks > 0)    s.push(weeks + ' week' + (weeks > 1 ? 's' : ''));
      if (days > 0)     s.push(days + ' day' + (days > 1 ? 's' : ''));
      if (hours > 0)    s.push(hours + ' hour' + (hours > 1 ? 's' : ''));
      if (minutes > 0)  s.push(minutes + ' minute' + (minutes > 1 ? 's' : ''));
      if (time > 0)     s.push((s.length > 0 ? 'and ' : '') + time + ' second' + (time > 1 ? 's' : ''));
      
      return s.join(', ');
   }
   
   function reset()
   {
      STOP = false;
      pause = false;
      openCalled = false;
      $("#S_OPENER_eta").html('');
      document.title = 'Finished!';
      $("#searchHorseInstance").data('alreadyFound', false);
   }
   
   function getSellObj()
   {
      if (GetFlag('S_OPENER_sell'))
      {
         return {
            method      : Get('S_OPENER_sellmethod', 'direct')
            ,equus      : parseInt(Get('S_OPENER_sellprice', 2000))
            ,passes     : 0
            ,calculate  : GetFlag('S_OPENER_calculateprice', 1)
            ,threshold  : parseInt(Get('S_OPENER_sellthreshold', '')) || 0
            ,negotiable : false
            ,player     : Get('S_OPENER_sellplayer', '')
         };
      }
      else
         return false;
   }
   
   function openHorses(_obj)
   {
      Wait("#searchHorseInstance", beginOpening, true);
      
      function getParallelLimit()
      {
         var x = 4;
         if (GetFlag('S_OPENER_board'))   x = 2;
         if (GetFlag('S_OPENER_care'))    x = 2;
         if (GetFlag('S_OPENER_blup'))    x = 2;
         if (GetFlag('S_OPENER_cover'))   x = 1;
         return parseInt(Get('S_OPENER_parallel')) > 0 ? parseInt(Get('S_OPENER_parallel')) : x;
      }
      
      function beginOpening()
      {
         synchronous(function* ()
         {
            timeStarted = now();
            var list = yield* getHorseList(typeof _obj.toOpen === N ? _obj.toOpen : 0);
            
            var totalToOpen = typeof _obj.toOpen === N ? _obj.toOpen : list.length;
            var listLength = list.length;
            var OpenedTabs = [];
            var totalOpened = 0;
            var currOpenCount = currentOpenTabsInTabArray(OpenedTabs).length;
            var parallelLimit = getParallelLimit();
            
            while (!STOP && list.length > 0)
            {
               timeLast = now();
               currOpenCount = currentOpenTabsInTabArray(OpenedTabs).length;
               parallelLimit = getParallelLimit();
               
               if (pause || currOpenCount >= parallelLimit)
               {
                  yield sleep(1000);
                  continue;
               }
               
               if (GetFlag('S_OPENER_cover') && Page.equus + parseInt(Get('wheatbran', 0)) < 1000)
               {
                  STOP = true;
                  continue;
               }
            
               var delay = Math.round((parseInt(Get('S_OPENER_delay_value')) || 1000) / 2);
               var toOpen = Math.min(parallelLimit - Math.min(totalToOpen, currOpenCount));
               
               var eta = (((timeLast - timeStarted) / totalOpened) * list.length) / 1000;
               var eta1k = (timeLast - timeStarted) / totalOpened;
               if (totalOpened > 1)
                  $("#S_OPENER_eta").html('ETA: ' + etaString(eta) + '<br>' + etaString(eta1k) + ' per 1,000 horses');
               
               for (var i = 0; i < Math.min(toOpen, list.length); i++)
               {
                  totalOpened++;
                  
                  // Configurable arguments to pass to the opened page(s)
                  var args = {
                     date        : nowMS()
                     ,arguments  : {
                        rename      : GetFlag('S_OPENER_rename')
                        ,board      : GetFlag('S_OPENER_board')
                        ,birth      : GetFlag('S_OPENER_birth')
                        ,care       : GetFlag('S_OPENER_care')
                        ,blup       : GetFlag('S_OPENER_blup')
                        ,cover      : GetFlag('S_OPENER_cover')
                        ,sell       : getSellObj()
                        ,move       : GetFlag('S_OPENER_move')
                        ,auto       : true
                     }
                  };
                  
                  var urlToOpen = list.shift();
                  var tab = GM_openInTab(urlToOpen, {active: GetFlag('S_OPENER_switchto', 0), insert: true});
                  Set('window_args_' + urlToOpen, JSON.stringify(args));
                  OpenedTabs.push(tab);
                  document.title = 'Opened ' + totalOpened + '/' + listLength;
                  
                  yield sleep( Rand(delay, delay * 3) );
               }
            }
            
            if (list.length === 0 || STOP)
               reset();
            else
               Log("Shouldn't have reached this...");
         });
      }
   }
   
   function* getHorseList(limit)
   {
      limit = typeof limit === N ? limit : 10000;
      
      var pages = $("#horseList").find("div.pageNumbering").eq(0).find("li.page");
      var currPage = parseInt(pages.filter(".selected").find("a").html() || '-1');
      var nextPage = pages.filter(':contains(' + (currPage + 1) + ')');
      
      var processed = 0;
      var lastList = $("#horseList").find("a.horsename");
      var linkList = [];
      addToList(lastList);
      
      function addToList(_list)
      {
         for (var j = 0; j < Math.min(_list.length, limit - processed); j++)
         {
            linkList.push(Page.url + _list.eq(j).attr('href'));
         }
         processed += _list.length;
      }
      
      while (processed < limit && nextPage.length > 0)
      {
         var thisPageList = lastList;
         
         Click( nextPage.find("a") );
         
         while (lastList.eq(0).attr('href') == thisPageList.eq(0).attr('href'))
         {
            thisPageList = $("#horseList").find("a.horsename");
            yield sleep( 100 );
         }
         
         pages = $("#horseList").find("div.pageNumbering").eq(0).find("li.page");
         currPage = parseInt(pages.filter(".selected").find("a").html() || '-1');
         nextPage = pages.filter(':contains(' + (currPage + 1) + ')');
      
         addToList(thisPageList);
         lastList = thisPageList;
      }
      
      return linkList;
   }

   
   // Retrieve breeding farms and store them
   (function()
   {
      Wait("#tabs-breedings", function(b)
      {
         var bTabs = b.find("a[id*='select-tab-']");
         
         if (bTabs.length > 0)
         {
            var regular = bTabs.eq(0).parent().tagName() !== 'h3';
            var tabList = [];
            
            for (var i = 0; i < bTabs.length; i++)
            {
               tabList.push({
                  id    : bTabs.eq(i).attr('href').reg('[0-9]+')
                  ,name : bTabs.eq(i).html().trim()
               });
            }
            
            if (tabList.length > 0)
            {
               //Set();
            }
         }
      }, true);
   })();
}

function M_HORSE_PAGE()
{
   Log('M_HORSE_PAGE module running');
   
   // Horse page menu setup
   (function()
   {
      CalculatedPriceOptionsMenu();
      var columns = CreateMenuItem('Horse Functions', 50, 25, 25);
      
      // Column A
      CreateHeader(columns.a, 'Automation Functions');
      
      CreateButton(columns.a, 'Log Care Schedule',  function() { PageArgs.care = true; CalculateActionList(); });
      CreateButton(columns.a, 'Log BLUP Schedule',  function() { PageArgs.blup = true; CalculateActionList(); });
      CreateNewline(columns.a);
      CreateButton(columns.a, 'Auto-Care', function() { CallStart('care'); });
      CreateButton(columns.a, 'Auto-BLUP', function() { CallStart('blup'); });
      CreateNewline(columns.a);
      CreateCheckboxPageArg(columns.a, "Auto-age until the top 3 skills are bolded", 'S_HORSE_PAGE_agebold', 'agebold');
      CreateNewline(columns.a);
      CreateCheckboxPageArg(columns.a, "Auto-age until it's ready to give birth", 'S_HORSE_PAGE_agebirth', 'agebirth');
      CreateNewline(columns.a);
      CreateCheckboxPageArg(columns.a, "Auto-age until it's coverable again", 'S_HORSE_PAGE_agecoverable', 'agecoverable');
      CreateNewline(columns.a);
      CreateNewline(columns.a);
      CreateText(columns.a, "Calculated Price (excluding the base price): " + CalculatePrice(0));
      CreateNewline(columns.a);
      CreateText(columns.a, "Calculated Price (including the base price): " 
                            + CalculatePrice(parseInt(Get('S_OPENER_sellprice', 2000))));
   })();
   
   
   var actionList = [], STARTED = false, STOP = false;
   var minimumDelay = 250, maximumDelay = 550;
   var compEquipmentStarted = false;
   var orderedGeneticSkills = H.bestGeneticSkills;    // The genetics of a horse, in order from highest to lowest
   
   
   function CalculateActionList()   // PLANS ACTIONS. Contains the routines for a horse, from foal to pass horse
   {
      actionList = [];           // List of actions that Chimera wants to try and perform
      var skillTrio = {
         start: topThreeBolded() ? 3 : 0
         ,end: topThreeBolded() && orderedGeneticSkills.length === 6  ? 6 : 3
      };
      
      function getAllowableAction(l, m, e)
      {
         var energyCost = (l / m) * Math.abs(e);
         
         var expectedEnergy = H.energy - energyCost;
         var expectedTime = H.timeLeft - l;
         var regain = regainPotential(expectedEnergy, expectedTime);
         expectedEnergy += regain.energy; 
         expectedTime -= regain.len;
         
         while (expectedEnergy < 20 || expectedTime < 0)
         {
            l -= m;
            energyCost = (l / m) * Math.abs(e);
            expectedEnergy = H.energy - energyCost;
            expectedTime = H.timeLeft - l;
            regain = regainPotential(expectedEnergy, expectedTime);
            expectedEnergy += regain.energy; 
            expectedTime -= regain.len;
         }
         
         return {
            lengthPossible    : l / 60
            ,minActionLength  : m
            ,energy           : energyCost
         };
      }
      
      function playAction(_min)
      {
         var en = 999;
         if (typeof UW.playEnergie === F)
            en = Math.abs(UW.playEnergie(0.5));
            
         var allowable = getAllowableAction(Math.floor((H.energy - 0.1) / en) * _min, _min, en);
         var projectedEnergy = H.energy - allowable.energy;
         var projectedTimeLeft = H.timeLeft - (allowable.lengthPossible * 60);
         var regain = regainPotential(projectedEnergy, projectedTimeLeft);
         var lengthPossible = Math.min(allowable.lengthPossible * 60, H.timeLeft - regain.len);
         
         return getAllowableAction(lengthPossible, _min, en);
      }
      
      function addPlayAction(_length)
      {
         actionList.push({
            type                    : 'play'
            ,minActionLength        : 30
            ,lengthSpecified        : typeof _length === N ? _length : 9999
            ,get energy()           { return playAction(this.minActionLength).energy; }
            ,get lengthPossible()   { return Math.min(this.lengthSpecified
                                                      ,playAction(this.minActionLength).lengthPossible); }
         });
      }
      
      function addBLUPActions()  // Shorthand for telling the routine to find something productive to do
      {
         function trainingAction(_skill, _min)       // Calculates training routine
         {
            function getTrainingEnergy(_skill)
            {
               // Finds the energy taken per time unit for a given trained skill, using Owlients own function
               if (_skill === 'st') return UW.entrainementCalculEnergieEndurance(1);
               if (_skill === 'sp') return UW.entrainementCalculEnergieVitesse(1);
               if (_skill === 'dr') return UW.entrainementCalculEnergieDressage(1);
               if (_skill === 'ga') return UW.entrainementCalculEnergieGalop(1);
               if (_skill === 'tr') return UW.entrainementCalculEnergieTrot(1);
               if (_skill === 'ju') return UW.entrainementCalculEnergieSaut(1);
            }
            
            var en = Math.abs(getTrainingEnergy(_skill));
            var completionPerUnit = H.bmi.timer ? 2 : 1;
            var trainingLeftToDo = (100 - H.training[_skill]) * completionPerUnit;
            
            var allowable = getAllowableAction(Math.floor((H.energy - 0.1) / en) * _min, _min, en);
            var projectedEnergy = H.energy - allowable.energy;
            var projectedTimeLeft = H.timeLeft - (allowable.lengthPossible * 60);
            var regain = regainPotential(projectedEnergy, projectedTimeLeft);
            
            var lengthPossible = Math.min(allowable.lengthPossible * 60, H.timeLeft - regain.len);
            lengthPossible = Math.min(lengthPossible, trainingLeftToDo * _min);
            
            return getAllowableAction(lengthPossible, _min, en);
         }
         
         function competitionAction(_min)             // Calculates competition routine
         {
            var en = 0;
            var lengthPossible = _min;
            
            return getAllowableAction(lengthPossible, _min, en);
         }
         
         function rideAction(_skill, _type, _min)     // Calculates rides routine
         {
            var completionPerUnit = 0.5;
            var ob = UW.ConsoleBalades.properties.foret;
            var en = Math.abs(ob.energie);
            if ((_type === 'forest' && ob.gains.dressage.percent === 1)
               || (_type === 'mountain' && ConsoleBalades.properties.montagne.gains.endurance.percent === 1))
               completionPerUnit = 1;
            var rideLeftToDo = (100 - H.rides[_skill]) / completionPerUnit;
            
            var allowable = getAllowableAction(Math.floor((H.energy - 0.1) / en) * _min, _min, en);
            var projectedEnergy = H.energy - allowable.energy;
            var projectedTimeLeft = H.timeLeft - (allowable.lengthPossible * 60);
            var regain = regainPotential(projectedEnergy, projectedTimeLeft);
            
            var lengthPossible = Math.min(allowable.lengthPossible * 60, H.timeLeft - regain.len);
            lengthPossible = Math.min(lengthPossible, rideLeftToDo * _min);
            
            return getAllowableAction(lengthPossible, _min, en);
         }
         
         if (GetFlag('S_OPENER_docompetitions', 1) && H.age >= 36 && H.age < 300 && H.pregnant < 2 && !PageArgs.nocomp)
         {
            var classicalPlannedCompsLists = [], westernPlannedCompsLists = [];
            
            function getCompType(lists)
            {
               var map = {};
               lists.forEach(function(l)
               {
                  l.forEach(function(s) { map[s] = map[s] + 1 || 1; });
               });
              
               var res = {};
               lists.sort(function(a, b)
               {
                  var res = a.length - b.length;
                  if (res === 0)
                  {
                     var guess = [a, b].map(function(l)
                     {
                        return l.reduce(function(x, y) { return x + map[y]; }, 0);
                     });
                     res = guess[0] - guess[1];
                  }
                  return res;
               }).forEach(function(l)
               {
                  for (var i in l) { if (res[l[i]]) return; }
                  l.sort(function(a, b)
                  {
                     var res = map[b] - map[a];
                     if (res === 0) res = b.localeCompare(a);
                     return res;
                  });
                  if (l.length > 0) res[l[0]] = 1;
               });
               return Object.keys(res);
            }
            
            var competitionSkillsets = {
               classical: {
                  st    : ['cross']
                  ,sp   : ['trot', 'gallop', 'jump']
                  ,dr   : ['trot', 'gallop', 'dressage', 'cross', 'jump']
                  ,ga   : ['gallop', 'dressage']
                  ,tr   : ['trot', 'dressage']
                  ,ju   : ['cross', 'jump']
               }
               ,western: {
                  st    : ['barrel', 'cutting', 'reining', 'pleasure']
                  ,sp   : ['barrel', 'cutting']
                  ,dr   : ['cutting', 'trail', 'reining', 'pleasure']
                  ,ga   : ['barrel', 'reining']
                  ,tr   : ['trail', 'pleasure']
                  ,ju   : ['trail']
               }
            };
            
            for (var i = skillTrio.start; i < skillTrio.end; i++)
            {
               if (!H.compGains[ orderedGeneticSkills[i] ])
               {
                  classicalPlannedCompsLists.push  ( competitionSkillsets.classical[orderedGeneticSkills[i]] );
                  westernPlannedCompsLists.push    ( competitionSkillsets.western[orderedGeneticSkills[i]] );
               }
            }
            
            var classicalCompTypes  = getCompType(classicalPlannedCompsLists);
            var westernCompTypes    = getCompType(westernPlannedCompsLists);
            
            if (H.specialty !== 'western' && H.specialty !== 'classical' && !compEquipmentStarted)
            {
               compEquipmentStarted = true;
               var compTab = $("#competition-body-content");
               
               if (compTab.length > 0)
               {
                  var _classical = compTab.find("#specialisationClassique").find("button[type='submit']");
                  var _western = compTab.find("#specialisationWestern").find("button[type='submit']");
                  var _attempts = 0;
                  
                  if (_classical.length > 0 && _western.length > 0)
                  {
                     if (classicalCompTypes.length <= westernCompTypes.length)
                        Click(_classical);
                     else
                        Click(_western);
                     
                     Wait("#competition-body-content a[onclick*='GetChoisirEquipement']", function(_e)
                     {
                        startEquipping(_e);
                     }, true);
                  }
                  else
                  {
                     startEquipping($("#competition-body-content a[onclick*='GetChoisirEquipement']"));
                  }
                  
                  function startEquipping(_e)
                  {
                     if (_e.length === 0) return;
                     Click(_e);
                     
                     Wait("#choisir-equipement-popup-content div.equipement-pop", function(_menu)
                     {
                        synchronous(function* ()
                        {
                           yield sleep( Rand(30, 120) );
                           _menu = _menu.parent();
                           
                           if (_menu.length === 0) return;
                           
                           var blankets = _menu.find("div[id*='modele-tapis-']");
                           var saddles = _menu.find("div[id*='modele-selle-']");
                           var bridles = _menu.find("div[id*='modele-bride-']");
                           var wraps = _menu.find("div[id*='modele-bande-']");
                           var bonnets = _menu.find("div[id*='modele-bonnet-']");
                           var submit = _menu.find("button[type='submit'][onclick*='DoChoisirEquip']");
                           
                           if (submit.length === 0) return;
                           
                           function getNumbers(list)
                           {
                              var newList = [];
                              for (var k = 0; k < list.length; k++)
                              {
                                 var count = list.eq(k).find("div.pastille-nombre");
                                 var ecOffered = list.eq(k).find("div:contains('ffered by')");
                                 
                                 if (ecOffered.length > 0)
                                    newList.push({ element: list.eq(k), count: 9999999 });
                                 else if (count.length > 0 && parseInt(count.html()) > 0)
                                    newList.push({ element: list.eq(k), count: parseInt(count.html()) });
                              }
                              newList.sort(function(a, b) { return b.count - a.count; });
                              return newList;
                           }
                           
                           function equipMostCommonTackItem(_list)
                           {
                              if (_list.length > 0)
                              {
                                 var sortedItems = getNumbers(_list);
                                 if (sortedItems.length > 0)
                                    Click(sortedItems[0].element);
                              }
                           }
                           
                           yield sleep( Rand(50, 150) );
                           equipMostCommonTackItem(blankets);
                           
                           yield sleep( Rand(50, 150) );
                           equipMostCommonTackItem(saddles);
                           
                           yield sleep( Rand(50, 150) );
                           equipMostCommonTackItem(bridles);
                           
                           yield sleep( Rand(50, 150) );
                           equipMostCommonTackItem(wraps);
                           
                           yield sleep( Rand(50, 150) );
                           equipMostCommonTackItem(bonnets);
                           
                           yield sleep( Rand(minimumDelay, maximumDelay) );
                           
                           Click( submit );
                           
                           Wait("#competition-body-content", addCompActions, true);
                        });
                     }, true);
                  }
               }
            }
            else
               addCompActions();
            
            function addCompActions()
            {
               var compTypes = H.specialty === 'classical' ? classicalCompTypes 
                                 : (H.specialty === 'western' ? westernCompTypes : null);
               var competitionInfo = competitionAction(120);
               var _minActionLength = competitionInfo.minActionLength;
               var perk = H.vipPerks.competitions;
               
               if (compTypes !== null && compTypes.length > 0)
               {
                  for (var i = 0; i < compTypes.length; i++)
                  {
                     actionList.push({
                        type                 : (perk ? 'vipcompetition_' : 'competition_') + compTypes[i]
                        ,get energy()        { return competitionAction(this.minActionLength).energy; }
                        ,minActionLength     : _minActionLength
                        ,get lengthPossible(){ return competitionAction(this.minActionLength).lengthPossible; }
                     });
                  }
               }
            }
         }
         
         if (GetFlag('S_OPENER_dorides', 1) && H.age >= 18 && H.age < 300 && H.pregnant < 2)
         {
            for (var i = skillTrio.start; i < skillTrio.end; i++)
            {
               if (H.rides[ orderedGeneticSkills[i] ] < 100)
               {
                  var _s = orderedGeneticSkills[i];
                  var rideType = _s == 'dr' || _s == 'ga' || _s == 'ju' ? 'forest' : 'mountain';
                  
                  var exists = false;
                  for (var j = actionList.length - 1; j > Math.max(actionList.length - 3, 0); j--)
                  {
                     if (actionList[j].type === 'ride_' + rideType)
                        exists = true;
                  }
                  if (exists)
                     continue;
                  
                  var rideInfo = rideAction(orderedGeneticSkills[i], rideType, 30);
                  var _minActionLength = rideInfo.minActionLength;
                  
                  actionList.push({
                     skill                : orderedGeneticSkills[i]
                     ,type                : 'ride_' + rideType
                     ,get energy()        {
                        return rideAction(this.skill, this.type.replace('ride_', ''), 30).energy;
                     }
                     ,minActionLength     : _minActionLength
                     ,get lengthPossible() {
                        return rideAction(this.skill, this.type.replace('ride_', ''), 30).lengthPossible;
                     }
                  });
               }
            }
         }
         
         if (GetFlag('S_OPENER_dotraining', 1) && H.age >= 24 && H.age < 300 && H.pregnant < 2)
         {
            for (var i = skillTrio.start; i < skillTrio.end; i++)
            {
               if (H.training[ orderedGeneticSkills[i] ] < 100)
               {
                  var trainingInfo = trainingAction(orderedGeneticSkills[i], 30);
                  var _minActionLength = trainingInfo.minActionLength;
                  
                  actionList.push({
                     skill                : orderedGeneticSkills[i]
                     ,type                : 'training'
                     ,get energy()        { return trainingAction(this.skill, this.minActionLength).energy; }
                     ,minActionLength     : _minActionLength
                     ,get lengthPossible(){ return trainingAction(this.skill, this.minActionLength).lengthPossible; }
                  });
               }
            }
         }
      }
      
      function addEnergyGainers()
      {
         if (H.actionsAvailable.stroke)
         {
            actionList.push({ type: 'stroke', energy: 0, minActionLength: 30, lengthPossible: 0.5, regainer: true });
            if (H.bmi.philotes)
               actionList.push({ type: 'stroke', energy: 0, minActionLength: 30, lengthPossible: 0.5, regainer: true });
         }
         
         if (H.actionsAvailable.drink)
            actionList.push({ type: 'drink', energy: 0, minActionLength: 15, lengthPossible: 0.25, regainer: true });
         
         if (H.actionsAvailable.carrot)
            actionList.push({ type: 'carrot', energy: 0, minActionLength: 15, lengthPossible: 0.25, regainer: true });
      }
      
      if (H.age < 6)    // Pre-game foals
      {
         if (H.actionsAvailable.stroke)
            actionList.push({ type: 'stroke', energy: 0, minActionLength: 30, lengthPossible: 0.5, regainer: true });
         
         if (H.actionsAvailable.drink)
            actionList.push({ type: 'drink', energy: 0, minActionLength: 15, lengthPossible: 0.25, regainer: true });
         
         if (H.actionsAvailable.carrot && H.age > 0 && H.energy < 20)
            actionList.push({ type: 'carrot', energy: 0, minActionLength: 15, lengthPossible: 0.25, regainer: true });
         
         if (H.actionsAvailable.nurse)
            actionList.push({ type: 'nurse', energy: 0, minActionLength: 30, lengthPossible: 0.5 });
      
         if (H.actionsAvailable.groom)
            actionList.push({ type: 'groom', energy: 0, minActionLength: 30, lengthPossible: 0.5 });
         
         if (H.actionsAvailable.bed)
            actionList.push({ type: 'bed', energy: 0, minActionLength: 0, lengthPossible: -1 });
      }
      else if (H.age >= 8 && H.age <= 16)    // Game foals
      {
         if (H.actionsAvailable.groom)
            actionList.push({ type: 'groom', energy: 0, minActionLength: 30, lengthPossible: 0.5 });
         
         if (H.actionsAvailable.bed)
            actionList.push({ type: 'bed', energy: 0, minActionLength: 0, lengthPossible: -1 });
         
         if (H.energy < 50 || H.morale < 50 || H.health < 60)
         {
            if (H.actionsAvailable.carrot)
               actionList.push({ type: 'carrot', energy: 0, minActionLength: 15, lengthPossible: 0.25, 
                                 regainer: true });
         
            if (H.fodderNeeded > 0)
               actionList.push({ type: 'feed', overfeed: 3, energy: 0, minActionLength: 30, lengthPossible: 0.5, 
                                 regainer: true });
            
            if (H.actionsAvailable.stroke)
               actionList.push({ type: 'stroke', energy: 0, minActionLength: 30, lengthPossible: 0.5, regainer: true });
            
            if (H.actionsAvailable.drink)
               actionList.push({ type: 'drink', energy: 0, minActionLength: 15, lengthPossible: 0.25, regainer: true });
         }
         else if (H.age >= 8 && H.age <= 12)
         {
            addPlayAction(1);
            
            if (H.actionsAvailable.carrot)
               actionList.push({ type: 'carrot', energy: 0, minActionLength: 15, lengthPossible: 0.25, regainer: true });
            
            if (H.fodderNeeded > 0)
               actionList.push({ type: 'feed', overfeed: 3, energy: 0, minActionLength: 30, lengthPossible: 0.5, 
                                 regainer: true });
            
            addPlayAction( (H.age === 8 ? 7.5 : (H.age === 10 ? 8 : 9)) );
            
            if (H.actionsAvailable.stroke)
               actionList.push({ type: 'stroke', energy: 0, minActionLength: 30, lengthPossible: 0.5, regainer: true });
            
            if (H.actionsAvailable.drink)
               actionList.push({ type: 'drink', energy: 0, minActionLength: 15, lengthPossible: 0.25, regainer: true });
         }
         else if (H.age === 14 || H.age === 16)
         {
            addPlayAction(2);
            
            if (H.actionsAvailable.carrot)
               actionList.push({ type: 'carrot', energy: 0, minActionLength: 15, lengthPossible: 0.25, 
                                 regainer: true });
            
            if (H.actionsAvailable.drink)
               actionList.push({ type: 'drink', energy: 0, minActionLength: 15, lengthPossible: 0.25, regainer: true });
            
            if (H.fodderNeeded > 0)
               actionList.push({ type: 'feed', overfeed: 3, energy: 0, minActionLength: 30, lengthPossible: 0.5, 
                                 regainer: true });
            
            addPlayAction( (H.age === 14 ? 9 : 9.5) );
            
            if (H.actionsAvailable.stroke)
               actionList.push({ type: 'stroke', energy: 0, minActionLength: 30, lengthPossible: 0.5, regainer: true });
         }
      }
      else if (H.age >= 18 || H.age === 6)   // Adults and 6 month old foals
      {
         if (H.actionsAvailable.bed)
            actionList.push({ type: 'bed', energy: 0, minActionLength: 0, lengthPossible: -1, regainer: true });
         
         if (H.actionsAvailable.groom)
            actionList.push({ type: 'groom', energy: 0, minActionLength: 30, lengthPossible: 0.5 });
      
         if (H.actionsAvailable.lesson && (PageArgs.care || (PageArgs.blup && H.pregnant === 2)))
            actionList.push({ type: 'lesson', energy: ((H.shower?0.9:1)*30), minActionLength: 120, lengthPossible: 2 });
         else if (PageArgs.blup)
            addBLUPActions();
         
         addEnergyGainers();
         
         if (H.actionsAvailable.mash && H.age >= 24)
            actionList.push({ type: 'mash', energy: 0, minActionLength: 30, lengthPossible: 0.5, regainer: true });
         
         if (H.fodderNeeded > 0 || H.oatsNeeded > 0)
            actionList.push({ type: 'feed', energy: 0, minActionLength: 30, lengthPossible: 0.5, regainer: true });
         
         if (PageArgs.blup)
            addBLUPActions();
         
         addEnergyGainers();
      }
      
      if (H.actionsAvailable.age)
         actionList.push({ type: 'age', energy: 0, minActionLength: 0, lengthPossible: -1 });
      
      Log(actionList);  // For debugging purposes
   }
   
   function* ProcessActionList(index)   // DOES ACTIONS. Makes sure it can do an action from the list, and does it
   {
      if (STOP || index >= actionList.length)
      {
         STARTED = false;
         return;
      }
      
      var A = actionList[index];
      Log('Calling action: ' + A.type + ' A.length: ' + A.lengthPossible + ' A.min: ' + A.minActionLength 
            + ' H.TimeLeft: ' + H.timeLeft + ' H.energy: ' + H.energy + ' A.energy: ' + A.energy
            + ' Regain.len: ' + regainPotential(H.energy - A.energy).len
            + ' Regain.energy: ' + regainPotential(H.energy - A.energy).energy);
      
      if (H.timeLeft - A.lengthPossible - (A.regainer ? 0 : regainPotential(H.energy - A.energy).len) >= 0)
      {
         var attempts = 0, proceed = true;
         
         function* checkActionAndProceed()
         {
            var maxAttemps = 100, _delay = 150;
            if (STOP) return;
            
            if (++attempts > maxAttemps)
            {
               yield* ProcessActionList(--index);
               return;
            }
            
            while (!CheckActionCompletion(A))
            {
               yield sleep(_delay);
               if (attempts % 2 === 0)
                  Log('action ' + A.type + ' not finished, waiting some more... (' + attempts + ')');
               yield* checkActionAndProceed();
               return;
            }
            
            if (!STOP)
            {
               Log('Calling process action for the next action');
               yield* ProcessActionList(++index);
            }
         }
         
         var aT = A.type, frenchSkillName = getFrenchSkillName(A.skill);
         
         var len = A.lengthPossible;
         if (len === 0 || len * 60 > H.timeLeft || A.minActionLength > H.timeLeft 
               || (len > 0 && len * 60 < A.minActionLength) || (typeof A.predicate === B && !A.predicate))
         {
            yield* ProcessActionList(++index);
            return;
         }
         
         if (aT.contains('ride'))
         {
            if (len <= 0 || A.energy > H.energy)
            {
               yield* ProcessActionList(++index);
               return;
            }
            
            var rideType = aT.contains('forest') ? 'foret' : (aT.contains('mountain') ? 'montagne' : 'plage');
            
            var rideButton = $("#boutonBalade-" + rideType);
            if (rideButton.length !== 1)     { checkActionAndProceed(); return; }
            Click(rideButton);
            
            yield sleep( Rand(minimumDelay, maximumDelay) );
            
            var rideLength = $("#walk" + rideType + "Slider").find("li[data-number='" + (len * 2) + "']");
            if (rideLength.length !== 1)     { checkActionAndProceed(); return; }
            Click(rideLength);
            
            yield sleep( Rand(minimumDelay, maximumDelay) );
            
            var rideSubmit = $("#walk-" + rideType + "-submit");
            if (rideSubmit.length !== 1)     { checkActionAndProceed(); return; }
            Click(rideSubmit);
         }
         else if (aT === 'training')
         {
            if (len <= 0 || A.energy > H.energy)
            {
               yield* ProcessActionList(++index);
               return;
            }
            
            var trainingButton = $("#training-tab-main").find("button[onclick*='\"" + frenchSkillName + "\"']");
            if (trainingButton.length !== 1) { checkActionAndProceed(); return; }
            Click(trainingButton);
            
            yield sleep( Rand(minimumDelay, maximumDelay) );
            
            var trainingLength = $("#training" + frenchSkillName.capitalize() + "Slider")
                                    .find("li[data-number='" + (len * 2) + "']");
            if (trainingLength.length !== 1) { checkActionAndProceed(); return; }
            Click(trainingLength);
            
            yield sleep( Rand(minimumDelay, maximumDelay) );
            
            var trainingSubmit = $("#training-" + frenchSkillName + "-submit");
            if (trainingSubmit.length !== 1) { checkActionAndProceed(); return; }
            Click(trainingSubmit);
         }
         else if (aT === 'play')
         {
            if (len <= 0)
            {
               yield* ProcessActionList(++index);
               return;
            }
            
            var playButton = $("#boutonJouer");
            if (playButton.length !== 1)  { checkActionAndProceed(); return; }
            Click(playButton);
            
            yield sleep( Rand(minimumDelay, maximumDelay) );
            
            var playLength = $("#centerPlaySlider").find("li[data-number='" + (len * 2) + "']");
            if (playLength.length !== 1)  { Log(playLength); checkActionAndProceed(); return; }
            Click(playLength);
            
            yield sleep( Rand(minimumDelay, maximumDelay) );
            
            var playSubmit = $("#formCenterPlaySubmit");
            if (playSubmit.length !== 1)  { checkActionAndProceed(); return; }
            Click(playSubmit);
         }
         else if (aT === 'feed')
         {
            var feed = $("#boutonNourrir"), o = typeof A.overfeed === N ? A.overfeed : 0;
            if (feed.length !== 1 || (H.fodderNeeded + o <= 0 && H.oatsNeeded + o <= 0))
            {
               yield* ProcessActionList(++index);
               return;
            }
            
            Click(feed);
            
            if (!H.vipPerks.feed && H.weight !== 'f')
            {
               yield sleep( Rand(minimumDelay, maximumDelay) );
               
               var result = yield* doFeed(false, o);
               
               if (!result)
                  yield* ProcessActionList(++index);
            }
         }
         else if (aT === 'nurse' && H.actionsAvailable.nurse)
         {
            var nurse = $("#boutonAllaiter");
            if (nurse.length !== 1) { yield* ProcessActionList(++index); return; }
            Click(nurse);
         }
         else if (aT === 'stroke' && H.actionsAvailable.stroke && (H.energy < 20 || H.timeLeft >= 120))
         {
            var stroke = $("#boutonCaresser");
            if (stroke.length !== 1)         { yield* ProcessActionList(++index); return; }
            Click(stroke);
         }
         else if (aT === 'drink' && H.actionsAvailable.drink && (H.energy < 20 || H.timeLeft >= 120))
         {
            var drink = $("#boutonBoire");
            if (drink.length !== 1)          { yield* ProcessActionList(++index); return; }
            Click(drink);
         }
         else if (aT === 'groom' && H.actionsAvailable.groom)
         {
            var groom = $("#boutonPanser");
            if (groom.length !== 1)          { yield* ProcessActionList(++index); return; }
            Click(groom);
         }
         else if (aT === 'mash' && H.actionsAvailable.mash && H.age >= 24 && (H.energy < 20
                  || (H.health < 70 && H.age < 300) || (PageArgs.blup && H.timeLeft >= 120 && H.pregnant < 2)))
         {
            var mash = $("#boutonMash");
            if (mash.length !== 1)           { yield* ProcessActionList(++index); return; }
            Click(mash);
         }
         else if (aT === 'carrot' && H.actionsAvailable.carrot && (H.energy < 20 || (H.age < 18 && H.age > 6) 
                  || (PageArgs.blup && H.timeLeft >= 120 && H.pregnant < 2)))
         {
            var carrot = $("#boutonCarotte");
            if (carrot.length !== 1)         { yield* ProcessActionList(++index); return; }
            Click(carrot);
         }
         else if (aT === 'lesson' && H.actionsAvailable.lesson)
         {
            var energyUse = ((H.shower ? 0.9 : 1) * 30);
            var _regain = regainPotential(H.energy - energyUse).energy;
            
            if (H.energy - energyUse <= 0 || H.energy - energyUse + _regain <= 20)
            {
               yield* ProcessActionList(++index);
               return;
            }
            
            var lessonButton = $("#mission-body-content").find("a[id*='boutonMission']");
            if (lessonButton.length !== 1)   { yield* ProcessActionList(++index); return; }
            Click(lessonButton);
         }
         else if (aT === 'bed' && H.actionsAvailable.bed)
         {
            var bed = $("#boutonCoucher");
            if (bed.length !== 1)            { yield* ProcessActionList(++index); return; }
            Click(bed);
         }
         else if (aT === 'age' && H.actionsAvailable.age && 
            (
               (PageArgs.agebold && !topThreeBolded()) 
            || (PageArgs.agecoverable && H.gender === 'F' && H.age >= 30 && !H.coverable)
            || (PageArgs.agebirth && H.gender === 'F' && H.age >= 30 && H.pregnant > 0 && !H.birthing)
            )
         )
         {
            var age = $("#boutonVieillir");
            if (age.length !== 1)            { yield* ProcessActionList(++index); return; }
            Click(age);
            
            yield sleep( Rand(minimumDelay, maximumDelay) );
            
            var ageSubmit = $("#night-tab-age").find("button[type='submit']");
            if (ageSubmit.length !== 1)      { yield* ProcessActionList(++index); return; }
            
            KeepPageArgs();
            LeaveArgs.nocomp = false;
            
            Click(ageSubmit);
         }
         else if (aT.contains('competition'))
         {
            var compType = aT.replace('competition_', '').replace('vip', '');
            var compButton = [], compTab = $("#competition-body-content");
            
            function getCompButton(_type)
            {
               return compTab.find("a[onclick*='type=" + _type + "'],[href*='&competition=" + _type + "']");
            }
            
            if (H.specialty === 'classical')
            {
               if (compType === 'trot')            compButton = getCompButton('trot');
               else if (compType === 'gallop')     compButton = getCompButton('galop');
               else if (compType === 'dressage')   compButton = getCompButton('dressage');
               else if (compType === 'cross')      compButton = getCompButton('cross');
               else if (compType === 'jump')       compButton = getCompButton('cso');
            }
            else if (H.specialty === 'western')
            {
               if (compType === 'barrel')          compButton = getCompButton('barrel');
               else if (compType === 'cutting')    compButton = getCompButton('cutting');
               else if (compType === 'trail')      compButton = getCompButton('trailClass');
               else if (compType === 'reining')    compButton = getCompButton('reining');
               else if (compType === 'pleasure')   compButton = getCompButton('westernPleasure');
            }
            
            if (compButton.length !== 1)  { yield* ProcessActionList(++index); return; }
            
            if (!aT.contains('vipcompetition')) // If we don't have VIP competitions, we need to enable auto-comp
            {                                   // When we're sent to the competition page, the competition script
               KeepPageArgs();
               LeaveArgs.competition = true;    //    will take over, and send us back here to continue BLUPing
            }
               
            Click(compButton);
            
            if (aT.contains('vipcompetition'))  // If we do have VIP competitions, we need to repeat this action
            {                                   //    as many times as we can until we can't do it anymore
               --index;
               yield* checkActionAndProceed();
            }
            return;
         }
         else
         {
            yield* ProcessActionList(++index);
            return;
         }
         
         yield* checkActionAndProceed();
      }
      else
         yield* ProcessActionList(++index);
   }
   
   function* StartActions()
   {
      STOP = false;
      
      if (!STARTED && !H.birthing)
      {
         STARTED = true;
         
         if ($("#care-head-title").length > 0)
            $("#care-head-title").html('');
         $("#care-head-title").find("#pause_button").remove();
         var pauseButton = CreateButton($("#care-head-title"), 'Pause', function()
         {
            if ($(this).html() === 'Pause')
            {
               STOP = true;
               $(this).html('Resume');
            }
            else
            {
               $(this).html('Pause');
               STARTED = false;
               synchronous(function* () { yield* StartActions(); });
            }
         });
         pauseButton.attr('style', 'margin: 0 0 0 10px;');
         
         if (PageArgs.blup && H.bolded.st && H.bolded.sp && H.bolded.dr && H.bolded.ga && H.bolded.tr && H.bolded.ju)
         {
            PageArgs.blup = false;
            PageArgs.care = true;
         }
         
         CalculateActionList();
         yield* ProcessActionList(0);
      }
   }
   
   function CallStart(type)
   {
      synchronous(function* ()
      {
         PageArgs.care = false;
         PageArgs.blup = false;
         PageArgs[type] = true;
         yield* StartActions();
      });
   }
   
   function CheckActionCompletion(action) // Used by the processing function to check whether the last action finished
   {
      var actionUrl = '/elevage/chevaux/', actionData = null, response = '';
      
      // actionUrl is the URL for the POST data request for that action
      // we want to watch the list of recent POST data requests to see if that action succeeded
      
      if      (action.type.contains('ride'))             actionUrl += 'doWalk';
      else if (action.type.contains('train'))            actionUrl += 'doTrain';
      else if (action.type.contains('stroke'))           actionUrl += 'doStroke';
      else if (action.type.contains('drink'))            actionUrl += 'doDrink';
      else if (action.type.contains('groom'))            actionUrl += 'doGroom';
      else if (action.type.contains('bed'))              actionUrl += 'doNight';
      else if (action.type.contains('nurse'))            actionUrl += 'doSuckle';
      else if (action.type.contains('feed'))             actionUrl += 'doEat';
      else if (action.type.contains('play'))             actionUrl += 'doPlay';
      else if (action.type.contains('lesson'))           actionUrl += 'doCentreMission';
      else if (action.type.contains('age'))              actionUrl += 'doAge';
      else if (action.type.contains('carrot'))           { actionUrl += 'doEatTreat'; actionData = 'friandise=carotte'; }
      else if (action.type.contains('mash'))             { actionUrl += 'doEatTreat'; actionData = 'friandise=mash'; }
      else if (action.type.contains('vipcompetition'))   actionUrl += 'doCompetitionRapide';
      
      return CheckAJAXCompetion(actionUrl, actionData);
   }
   
   function topThreeBolded()
   {
      var allBolded = true;
      for (var k = 0; k < Math.min(orderedGeneticSkills.length, 3); k++)
      {
         if ( !H.bolded[orderedGeneticSkills[k]] )
            allBolded = false;
      }
      return allBolded;
   }
   
   function* doFeed(manual, overfeed)
   {
      if (H.vipPerks.feed || H.weight === 'f' || (H.fodderNeeded + overfeed <= 0 && H.oatsNeeded + overfeed <= 0))
         return false;
      
      var feed = $("#boutonNourrir");
      var feedTab = $("#care-tab-feed");
      overfeed = typeof overfeed === N ? overfeed : 0;
      manual = typeof manual === B ? manual : true;
      
      if (feed.length === 0 || feedTab.length === 0)
         return false;
      
      if (manual)
      {
         Click(feed);
         yield sleep( Rand(minimumDelay, maximumDelay) );
      }
      
      if (H.fodderNeeded > 0)
      {
         var fodderAmount = Math.min(H.fodderNeeded + overfeed, 20);
         var haySlider = feedTab.find("#haySlider").find("li[data-number='" + fodderAmount + "']");
         if (haySlider.length !== 1)   return false;
         Click(haySlider);
      }
      
      if (H.oatsNeeded > 0)
      {
         if (H.fodderNeeded > 0)
            yield sleep( Rand(10, 40) );
         
         var oatsAmount = Math.min(H.oatsNeeded + overfeed, 15);
         var oatsSlider = feedTab.find("#oatsSlider").find("li[data-number='" + oatsAmount + "']");
         if (oatsSlider.length !== 1)  return false;
         Click(oatsSlider);
      }
      
      yield sleep( Rand(minimumDelay, maximumDelay) );
      
      var feedSubmit = $("#feed-button");
      if (feedSubmit.length !== 1)     return false;
      Click(feedSubmit);
      
      return true;
   }
   
   function* ChangeName(name)
   {
      // If the function wasn't given a name to use, calculate one
      name = typeof name === U || name === null ? calculateName() : name;
      if (H.name !== name || PageArgs.move)  // If the calculated name isn't the current name or if we're just moving
      {
         var openMenu = $("#col-center").find("div[class*='options'][onclick*='menuActionToggle(']");
         if (openMenu.length > 0)
            Click( openMenu );  // Open the menu dropdown
         
         yield* SyncWait("div[class='options-menu']:visible", function* (obj)
         {
            var menuOpen = obj.find("a[onclick*='showBox(\"profil-popup\")']");
            
            if (menuOpen.length > 0)
            {
               Click( menuOpen.eq(0) );  // Open the renaming menu
               
               yield* SyncWait("#horseNameName", function* (objN)
               {
                  if (PageArgs.rename)
                     objN.val(name.toString());  // Set the name and confirm
                  
                  // If both parents have a particular affix, and if that affix is available for use, use it
                  var affixSelect = $("#horseName").find("#horseNameAffixe").eq(0);
                  if (affixSelect.length > 0 && affixSelect.val() === '' && PageArgs.rename
                      && H.father.affix.url && H.mother.affix.url && H.father.affix.url === H.mother.affix.url )
                  {
                     if (affixSelect.find("option[value='" + H.father.affix.url.reg('[0-9]+') + "']").length === 1) 
                        affixSelect.val( H.father.affix.url.reg('[0-9]+') );
                  }
                  
                  if (PageArgs.move)
                  {
                     var farmSelection = $("#horseNameElevage");
                     
                     if (farmSelection.length > 0)
                     {
                        var farmID = typeof PageArgs.move === N ? PageArgs.move.toString() : PageArgs.move;
                        if (farmID.length > 0)
                           farmSelection.val(farmID);
                     }
                  }
                  
                  var confirm = $("#horseName").find("button[type='submit']");
                  if (confirm.length > 0)
                  {
                     yield sleep(Rand(20, 110));
                     KeepPageArgs();
                     Click( confirm.eq(0) );
                  }
               }, true);
            }
         }, true);
      }
   }
   
   function* SellHorse(price)
   {
      price = typeof price === N ? price : PageArgs.sell.equus;
      if (typeof price !== N) return;
      
      var openMenu = $("#col-center").find("div[class*='options'][onclick*='menuActionToggle(']");
      if (openMenu.length > 0)
         Click( openMenu );  // Open the menu dropdown
      
      yield* SyncWait("div[class='options-menu']:visible", function* (obj)
      {
         var menuOpen = obj.find("a[onclick*='showBox(\"trade-popup\")']");
         
         if (menuOpen.length > 0)
         {
            Click( menuOpen.eq(0) );  // Open the selling menu
            
            yield* SyncWait("#trade-popup-content", function* (objN)
            {
               var sellButton = objN.find("a.action[href*='/marche/vente/vendre?id=']");
               var shButton = objN.find("form#doHavreVendreForm");
               
               var shPrice = parseInt((objN.find('img.monnaie').parent().find('strong').html()||'').replace(/ /g, ''));
               shPrice = isNaN(shPrice) ? 400 : shPrice;
               
               if (sellButton.length > 0 && (price > shPrice || PageArgs.sell.method === 'reserve'))
               {
                  yield sleep(Rand(20, 110));
                  Log('Selling the horse for ' + price + ' equus via ' + PageArgs.sell.method);
                  KeepPageArgs();
                  PageArgs.sell.equus = price;
                  Click( sellButton.eq(0) );
               }
               else if (shButton.length > 0 && (price <= shPrice || PageArgs.sell.method === 'haven'))
               {
                  yield sleep(Rand(20, 110));
                  Log('Havening the horse');
                  shButton.submit();
               }
               else
                  Click( $("#trade-popup").find('a.close-popup').eq(0) );
            }, true);
         }
      }, true);
   }
   
   function board()
   {
      if (!PageArgs.board && !PageArgs.care && !PageArgs.blup) return false;
      
      var boardButton = $("#cheval-inscription").find("a");
      if (boardButton.length > 0)
      {
         KeepPageArgs();
         LeaveArgs.board = true;
         LeaveArgs.boardInfo = {
            age         : H.age
            ,energy     : H.energy
            ,health     : H.health
            ,morale     : H.morale
            ,pregnant   : H.pregnant
            ,specialty  : H.specialty
            ,divine     : H.divine
            ,skills     : H.skills
            ,bolded     : H.bolded
         };
         Click(boardButton.eq(0));
         return true;
      }
      return false;
   }
   
   function* doCover()
   {
      if (H.gender === 'F' && H.coverable)
      {
         var rep = $("#reproduction-body-content");
         var coverMare = rep.find("a.action[href*='/elevage/chevaux/rechercherMale?jument=']");
         
         if (coverMare.length > 0)
         {
            var cArgs = {
               maxPrice: 500
            };
            
            KeepPageArgs();
            LeaveArgs.coverArgs = JSON.stringify(cArgs);
            
            Log('Going to covering page');
            Click( coverMare.eq(0) );
            
            yield sleep(10000);
         }
      }
   }
   
   function closeBirthPopup()
   {
      var _close = $("#alerteVeterinaireBox:visible").find("a.close-popup");
      if (_close.length > 0)
         Click(_close.eq(0));
   }
   
   function* doBirth()
   {
      var _vetLink = $("#reproduction-body-content").find("a[href*='/elevage/chevaux/mettreBas?jument=']");
      
      if (_vetLink.length > 0)
      {
         closeBirthPopup();
         
         var _args = {
            date        : nowMS()
            ,arguments  : {
               birth    : true
               ,rename  : true
               ,move    : H.farm
               ,auto    : PageArgs.auto
            }
         };
         
         Set('M_HORSE_PAGE_' + H.id, 0);
         
         var urlToOpen = Page.url + _vetLink.attr('href');
         var tab = GM_openInTab(urlToOpen, {active: true, insert: true});    // Open vet page
         Set('window_args_' + urlToOpen, JSON.stringify(_args));
         
         var directNamingUrl = Page.url + '/elevage/chevaux/choisirNoms?jument=' + _vetLink.attr('href').reg('[0-9]+');
         Set('window_args_' + directNamingUrl, JSON.stringify(_args));
         
         while (!GetFlag('M_HORSE_PAGE_' + H.id)) { Log(GetFlag('M_HORSE_PAGE_' + H.id)); yield sleep(300); }
         
         if (GetFlag('M_HORSE_PAGE_' + H.id))
         {
            Delete('M_HORSE_PAGE_' + H.id);
            KeepPageArgs();
            Reload();
         }
      }
   }
   
   function CalculatePrice(_price)
   {
      function addBasicPrice(name, predicate, val)
      {
         addPrice(GetFlag('S_PRICE_' + name, 0) && predicate, parseInt(Get('S_PRICE_' + name + 'Value', 0)) || 0);
      }
      function addPrice(predicate, val)
      {
         _price += predicate ? val : 0;
         //Log(predicate + ' : ' + val);
      }
      
      addBasicPrice('adult', H.age >= 18);
      addBasicPrice('female', H.gender === 'F');
      addBasicPrice('immortal', H.bmi.stone);
      addBasicPrice('ga', H.bmi.ga);
      addBasicPrice('rga', H.bmi.rga);
      addBasicPrice('5th', H.bmi.fifth);
      addBasicPrice('timer', H.bmi.timer);
      addBasicPrice('poseidon', H.bmi.poseidon);
      addBasicPrice('achilles', H.bmi.achilles);
      addBasicPrice('pregnant', H.pregnant > 0);
      addBasicPrice('purebred', H.purebred);
      addBasicPrice('foundation', H.foundation);
      addBasicPrice('pegasus', H.bmi.medusa);
      addBasicPrice('unicorn', H.species.type === 'Unicorn');
      addBasicPrice('woy', H.bmi.woy);
      addBasicPrice('arms', H.bmi.arms);
      addBasicPrice('helios', H.bmi.helios);
      addBasicPrice('apollos', H.bmi.apollos);
      addBasicPrice('poc', H.bmi.poc);
      addBasicPrice('pocp', H.bmi.pocp);
      addBasicPrice('sota', H.bmi.sota);
      addBasicPrice('magic', H.bmi.magichat);
      addBasicPrice('pumpkin', H.bmi.pumpkin);
      addBasicPrice('companion', H.companion);
      
      addPrice(GetFlag('S_PRICE_' + 'rarecoat', 0) && typeof H.coat.rarity === N && H.coat.rarity <= 5
               , (parseInt(Get('S_PRICE_' + 'rarecoat' + 'Value', 0)) || 0) * (6 - H.coat.rarity));
      
      addBasicPrice('over20', H.age >= 240);
      addPrice(GetFlag('S_PRICE_' + 'over20Inc', 0) && H.age >= 252
               , (parseInt(Get('S_PRICE_' + 'over20Inc' + 'Value', 0)) || 0) * parseInt((H.age / 12) - 20));
      
      addBasicPrice('gp', H.gp >= (parseInt(Get('S_PRICE_' + 'gpThresh', 0)) || 0));
      addPrice(GetFlag('S_PRICE_' + 'gpIncrement', 0) && H.gp >= 100 + (parseInt(Get('S_PRICE_' + 'gpThresh', 0)) ||0)
               , (parseInt(Get('S_PRICE_' + 'gpIncrement', 0)) || 0) 
                     * (H.gp.roundTo(100) - (parseInt(Get('S_PRICE_' + 'gpThresh', 0)) || 0)));
      
      addBasicPrice('blup', H.blup >= (parseInt(Get('S_PRICE_' + 'blupT', 0)) || 0));
      addPrice(GetFlag('S_PRICE_' + 'blupInc', 0) && H.blup >= 5 + (parseInt(Get('S_PRICE_' + 'blupT', 0)) || 0)
               , (parseInt(Get('S_PRICE_' + 'blupInc', 0)) || 0) 
                     * (H.blup.roundTo(5) - (parseInt(Get('S_PRICE_' + 'blupT', 0)) || 0)) + 100);
      
      addBasicPrice('skills', H.skills.total >= (parseInt(Get('S_PRICE_' + 'skillsT', 0)) || 0));
      addPrice(GetFlag('S_PRICE_' + 'skillsInc', 0) && H.skills.total >= 100 
                     + (parseInt(Get('S_PRICE_' + 'skillsT', 0)) || 0)
               , (parseInt(Get('S_PRICE_' + 'skillsInc', 0)) || 0) 
                     * (H.skills.total.roundTo(100) - (parseInt(Get('S_PRICE_' + 'skillsT', 0)) || 0)));
      
      if (GetFlag('S_PRICE_' + 'passhorse', 0) && H.passhorse)
         return (parseInt(Get('S_PRICE_' + 'passhorse' + 'Value', 0)) || 0);
      
      return _price;
   }
   
   
   // PageArgs processing
   synchronous(function* ()
   {
      if (PageArgs.logSuccessfulBirth)
      {
         Set('M_HORSE_PAGE_' + H.mother.url.reg('[0-9]+'), 1);
      }
   
      if (PageArgs.rename || PageArgs.move)
      {
         yield* ChangeName( (typeof PageArgs.rename === S && PageArgs.rename.length > 0 ? PageArgs.rename : null) );
      }
      
      if (PageArgs.board || PageArgs.care || PageArgs.blup || PageArgs.cover || PageArgs.birth)
      {
         if (board())
            return;
            
         if (H.birthing)
           yield* doBirth();
         
         if ((PageArgs.care || PageArgs.blup)
               && (!PageArgs.agecoverable || (PageArgs.agecoverable && !H.coverable))
               && (!PageArgs.agebirth || (PageArgs.agebirth && !H.birthing)))
            yield* StartActions();
         
         if (PageArgs.cover && H.age >= 30 && H.age < 300)
            yield* doCover();
      }
      
      
      if (PageArgs.sell)
      {
         var defaultPrice = typeof PageArgs.sell.equus === N ? PageArgs.sell.equus : 2000;
         var calculatedPr = PageArgs.sell.calculate ? CalculatePrice(defaultPrice) : 0;
         
         if (typeof PageArgs.sell.threshold === N && defaultPrice + calculatedPr >= PageArgs.sell.threshold)
            yield* SellHorse( Math.max(500, Math.min(1000000, calculatedPr)) );
      }
      
      if (PageArgs.auto)
      {
         yield sleep( Rand(500, 1100) );
         Close();
      }
   });
   
   
   // Page buttons
   (function()
   {
      if (PageArgs.auto || PageArgs.care || PageArgs.blup)
         return;
      
      $("#care-head-title").html("");
      
      if (H.age >= 6)
      {
         var feedButton = CreateButton($("#care-head-title"), 'Feed', function()
            { synchronous(function* () { yield* doFeed(true, 0); }); });
         feedButton.attr('style', 'margin: 0 10px 0 0;');
      }
      
      var careButton = CreateButton($("#care-head-title"), 'Care', function() { CallStart('care'); });
      var blupButton = CreateButton($("#care-head-title"), 'BLUP', function() { CallStart('blup'); });
      
      careButton.attr('style', 'margin: 0 10px 0 0;');
      blupButton.attr('style', 'margin: 0 0 0 0;');
      
      
      Wait("#horseNameName", function(e)
      {
         var td = e.parents('tr').find('span.italic').parent();
         td.html('');
         
         var gpNameButton = CreateButton(td, 'Gender + GP', function() { e.val(H.gender + H.gp.toFixed(2)); });
         gpNameButton.attr('style', 'margin: 0 10px 0 0;');
         
      }, true);
   })();
   
   
   // Action maximum time pre-select
   (function()
   {
      if (PageArgs.auto || PageArgs.care || PageArgs.blup)
         return;
   
      function preselectMax(e, m)
      {
         var _max = e.find("li[data-number" + (typeof m === N ? "='" + m + "'" : '') + "]:not(.disabled)").last();
         if (_max.length > 0)
            Click(_max);
      }
      
      Wait("#haySlider:visible", function(e) { preselectMax(e, H.fodderNeeded); }, false);
      Wait("#oatsSlider:visible", function(e) { preselectMax(e, H.oatsNeeded); }, false);
      
      if (H.rides.dr < 100)   Wait("#walkforetSlider:visible", preselectMax, false);
      if (H.rides.sp < 100)   Wait("#walkmontagneSlider:visible", preselectMax, false);
      // Wait("#walkplageSlider:visible", preselectMax, false);
      
      if (H.training.st < 100)   Wait("#trainingEnduranceSlider:visible", preselectMax, false);
      if (H.training.sp < 100)   Wait("#trainingVitesseSlider:visible", preselectMax, false);
      if (H.training.dr < 100)   Wait("#trainingDressageSlider:visible", preselectMax, false);
      if (H.training.ga < 100)   Wait("#trainingGalopSlider:visible", preselectMax, false);
      if (H.training.tr < 100)   Wait("#trainingTrotSlider:visible", preselectMax, false);
      if (H.training.ju < 100)   Wait("#trainingSautSlider:visible", preselectMax, false);
   })();
   
   
   // AP tracking
   (function()
   {
      if (GetFlag('S_OPENER_apStart', 0))
      {
         Set('S_OPENER_apStart', 0);
         Set('S_OPENER_apStartValue', H.ap);
      }
      
      Set('S_OPENER_apLastValue', H.ap);
   })();
   
   
   // Hotkeys
   (function()
   {
      if (PageArgs.auto || PageArgs.care || PageArgs.blup)
         return;
      
      $(document).bind('keydown', 'alt+n', function() { PageArgs.rename = true; synchronous(ChangeName); });
      $(document).bind('keydown', 'alt+s', function()
      {
         PageArgs.sell = {
            method      : 'direct'
            ,equus      : CalculatePrice(parseInt(Get('S_OPENER_sellprice', 2000)))
         };
         synchronous(SellHorse);
      });
   })();
}

function M_HORSE_WEIGHTINDICATOR()
{
   Log('M_HORSE_WEIGHTINDICATOR module running');
   
   var _weight = H.weight;    // Red for too fat, blue for too skinny. Makes it easier for nonVIP's to see nice women
   var _text = $("#boutonNourrir").find("span:contains('Feed')");
   if (_text.length > 0 && _weight === 's')      _text.attr("style", "color: blue;");
   else if (_text.length > 0 && _weight === 'f') _text.attr("style", "color: red; font-weight: bold;");  // It's 4am :/
}

function M_FOALING()
{
   Log('M_FOALING module running');
   
   var page = $("#page-contents");
   var inputs = page.find("input.text[name*='poulain-'][id*='poulain-']");
   var submit = page.find("button[type='submit']");
   
   synchronous(function* ()
   {
      for (var i = 0; i < inputs.length; i++)
      {
         var gender = inputs.eq(i).parent().find("img").eq(0).attr("alt") === 'femelle' ? 'F' : 'M';
         inputs.eq(i).val(gender);
      }
      
      if (PageArgs.auto || PageArgs.birth || PageArgs.care || PageArgs.blup)
      {
         KeepPageArgs();
         
         if (PageArgs.auto)
            LeaveArgs.logSuccessfulBirth = true;
         
         LeaveArgs.birth = false;
         
         Click(submit);
      }
   });
}

function M_BOARD()
{
   Log('M_BOARD module running');
   
   var columns = CreateMenuItem('Boarding', 40, 25, 35);
   
   CreateButton(columns.a, 'Auto-Board', Board);
   CreateButton(columns.a, 'Auto-Sort', Board);
   
   var STARTED = false;
   var iterations = 0;
   var lowerStandards = 0;
   var duration = 3;
   
   if (PageArgs.board)
   {
      KeepPageArgs();
      UW.redirectionCheck = "e.page.indexOf('doCentreInsc') !== -1 && _obj.redirection.indexOf('cheval?id') === -1";
      UW.redirectionPredicate = 'reload';
      Board();
   }
   
   function Board()
   {
      if (!STARTED)
      {
         Wait("#cheval-centre-inscription", FindCentre, false);
         STARTED = true;
      }
   }
   
   function FindCentre()
   {
      synchronous(function* ()
      {
         Log('New EC list loaded, iterations: ' + iterations);
         
         function* cycleTripleState(_element, _target)
         {
            while (_element.find("input").val() != threeStateConverter(_target))
            {
               yield sleep( Rand(30, 80) );
               Click(_element);
            }
         }
         
         if (iterations === 0)
         {
            Log('Starting application of search parameters with a standard level of ' + lowerStandards);
            
            var minDelay = 25, maxDelay = 125;
            
            var form = $("#cheval-centre-inscription");
            
            var fodderCheckbox      = form.find("#fourrageCheckbox");
            var oatsCheckbox        = form.find("#avoineCheckbox");
            var carrotsCheckbox     = form.find("#carotteCheckbox");
            var mashCheckbox        = form.find("#mashCheckbox");
            var showerCheckbox      = form.find("#doucheCheckbox");
            var troughCheckbox      = form.find("#abreuvoirCheckbox");
            var saddleCheckbox      = form.find("#hasSellesCheckbox");
            var bridleCheckbox      = form.find("#hasBridesCheckbox");
            var clothCheckbox       = form.find("#hasTapisCheckbox");
            var bonnetsCheckbox     = form.find("#hasBonnetsCheckbox");
            var poloCheckbox        = form.find("#hasBandesCheckbox");
            
            var forestCheckbox      = form.find("#foretCheckbox");
            var mountainCheckbox    = form.find("#montagneCheckbox");
            var beachCheckbox       = form.find("#plageCheckbox");
            
            var classicalCheckbox   = form.find("#classiqueCheckbox");
            var westernCheckbox     = form.find("#westernCheckbox");
            
            var dailyCostSelect     = form.find("#tarif");
            var missionPriceSelect  = form.find("#leconsPrix");
            var formSubmit          = form.find("button[type='submit']").eq(0);
            
            yield* cycleTripleState(fodderCheckbox,    (lowerStandards < 4 ? 'yes' : 'maybe'));
            yield* cycleTripleState(oatsCheckbox,      (lowerStandards < 4 ? 'yes' : 'maybe'));
            yield* cycleTripleState(carrotsCheckbox,   (lowerStandards < 5 ? 'yes' : 'maybe'));
            
            if (PageArgs.blup)
            {
               if (PageArgs.boardInfo && (PageArgs.boardInfo.age >= 18 || PageArgs.blup))
                  yield* cycleTripleState(beachCheckbox,     (lowerStandards < 6 ? 'no' : 'maybe'));
               
               if (PageArgs.boardInfo && (PageArgs.boardInfo.age >= 18 || PageArgs.blup))
                  yield* cycleTripleState(mashCheckbox,      (lowerStandards < 3 ? 'yes' : 'maybe'));
               
               yield* cycleTripleState(showerCheckbox,    (lowerStandards < 5 ? 'yes' : 'maybe'));
               yield* cycleTripleState(troughCheckbox,    (lowerStandards < 4 ? 'yes' : 'maybe'));
            }
            
            if (PageArgs.boardInfo && (PageArgs.boardInfo.age >= 24 || PageArgs.blup))
               missionPriceSelect.val( (lowerStandards < 1 ? 40 : '') );
            
            dailyCostSelect.val( Math.min(30 + (lowerStandards * 20), 200) );
            
            yield sleep( Rand(minDelay, maxDelay) );
            
            Log('Applying search parameters considering a standard level of ' + lowerStandards);
            
            Click(formSubmit);
            iterations++;
         }
         else
         {
            function researchCentres()
            {
               Log('Researching new centres, this time with a standard of ' + (lowerStandards + 1));
               iterations = 0;
               ++lowerStandards;
               setTimeout(FindCentre, 30);
            }
            
            if ($("#centresContent").find("#messageBoxInline").find("img[alt='pictoalert']").length > 0)
            {
               Log('No centres found');
               researchCentres();
               return;
            }
            
            var table = $("#table-0").eq( PageArgs.own && $("#table-0").eq(1).length === 1 ? 1 : 0 );
            var sort = table.find("a[onclick*='tarif2']:contains('" + duration + " days')");
            var list = table.find("tr[class*='highlight']").find("button[onclick*='&duree=" + duration + "&']");
         
            if (iterations === 1 && sort.length > 0 && sort.parent().find("img[alt='ascendant']").length === 0)
            {
               Log('Sorting EC list');
               Click(sort);
               iterations++;
               return;
            }
            else if (list.length > 0)
            {
               function clickEC(index)
               {
                  var price = parseInt(list.eq(index).find("strong").html() || '') || -1;
                  
                  Log('Trying EC, cost is ' + price);
                  
                  if (price !== -1 && Page.equus > price && list.eq(index).length > 0)
                  {
                     function isError()
                     {
                        if ( list.eq(index).parents('tr').find('#fieldError-centreMaximum').length > 0 )
                        {
                           Log('Error trying to board in a centre, trying another one on the list');
                           clickEC(++index);
                        }
                        else
                           setTimeout(isError, 200);
                     }
                     
                     function isBlankResponse()
                     {
                        for (var i = AJAX.length - 1; i >= 0; i--)
                        {
                           if (AJAX[i].url.contains('doCentreInscription') && AJAX[i].response === '')
                              clickEC(index);
                           else
                              setTimeout(isBlankResponse, 500);
                        }
                     }
                     
                     function doClick()
                     {
                        STARTED = false;
                        Log('Clicking on the EC board button');
                        Click( list.eq(index) );
                        isError();
                        isBlankResponse();
                     }
                     
                     setTimeout(doClick, Rand(50, 250));
                  }
                  else
                  {
                     if (price === -1)
                        researchCentres();
                     else if (Page.equus <= price)
                     {
                        Log('Equus:');
                        Log(Page.equus);
                        /*
                        ObtainEquus(9000 - Page.equus);
         
                        function waitForNewEquus()
                        {
                           if (parseInt(Get('equus', 0)) * 2 > price)
                              clickEC(index);
                           else if (GetFlag('wheatbran'))
                              setTimeout(waitForNewEquus, 200);
                           else
                              researchCentres();
                        }
                        
                        waitForNewEquus();
                        */
                     }
                  }
               }
               
               clickEC(0);
            }
            else if (Page.equus > Math.min(30 + ((lowerStandards + 1) * 20), 200) * duration)
            {
               researchCentres();
               return;
            }
         }
      });
   }
   
   function threeStateConverter(s)
   {
      if (s === 'yes')     return 1;
      if (s === 'no')      return 0;
      if (s === 'maybe')   return 2;
   }
}

function M_COMPETITIONS()
{
   Log('M_COMPETITIONS module running');
   
   var columns = CreateMenuItem('Competitions', 40, 25, 35);
   
   
   Wait("#public", findComp, true);
   Wait("#messageBoxInline", goBack, true);
   
   function goBack()
   {
      var horseLink = $("#table-0").find("a[href*='/elevage/chevaux/cheval?id=']");
      if (horseLink.length > 0 && PageArgs.competition)
      {
         KeepPageArgs();
         LeaveArgs.nocomp = true;
         Click(horseLink.eq(0));
      }
   }
   
   function findComp()
   {
      // List of all competitions, for both the breed only and the public ones, and combine them into one list
      var compList = $("a[href*='/elevage/competition/fiche?type='][class='competition']");
      
      Log('Found ' + compList.length + ' competition elements');
      
      var consideredList = [];   // A list of objects, which we can sort once we populate it
      var horseEnergy = parseFloat($("#table-0").find("span:contains('%')").html().reg('[0-9]+.?[0-9]+'));
      
      for (var i = 0; i < compList.length; i++)
      {
         var row = compList.eq(i).parents("tr").eq(0);
         var button = row.find("button[onclick*='doCompetition']");
         var participants = row.find("a.horsename");
         var energy = parseFloat(row.find("strong:contains('%')").html()) || -1;
         
         // Add something usable to a list of comps
         consideredList.push({ button: button, energy: energy, participants: participants.length }); 
      }
      
      // Now we can sort the list of competitions by the energy of each competition
      consideredList.sort(function(a, b)
      {
         if (a.energy === b.energy)
            return b.participants - a.participants;
         else
            return a.energy - b.energy;
      });
      
      Log('Sorted a list of ' + consideredList.length + ' competitions. horseEnergy: ' + horseEnergy);
      
      // If the horse can do the competition, and if we're meant to choose one, do the first comp in the list
      if (PageArgs.competition && !isNaN(horseEnergy))
      {
         if (horseEnergy + 0.1 > consideredList[0].energy)
         {
            KeepPageArgs();      // Assuming we were brought here to autoComp, ensure we continue to autoBLUP
            Click(consideredList[0].button); // This should be the lowest energy competition
         }
         else
            goBack();
      }
   }
}

function M_COVER()
{
   Log('M_COVER module running');
   
   var columns = CreateMenuItem('Covering', 34, 33, 33);
   
   CreateButton(columns.a, 'Auto-Cover, Max 500e', Cover);
   
   
   var STARTED = false;
   var iterations = typeof PageArgs.iteration !== N ? 0 : PageArgs.iteration;
   var lowerStandards = typeof PageArgs.standard !== N ? 0 : PageArgs.standard;
   var args = typeof PageArgs.coverArgs === O ? PageArgs.coverArgs : {};
   
   function Cover()
   {
      if (!STARTED)
      {
         KeepPageArgs();
         Wait("#table-0", FindCover, true);
         Wait("#messageBoxInline", Close, true);
      }
   }
   
   function FindCover(e)
   {
      Log('Starting');
      
      STARTED = true;
      
      function coverPageArgSave()
      {
         LeaveArgs.iteration = ++iterations;
         LeaveArgs.standard = lowerStandards;
         LeaveArgs.cover = true;
      }
      
      synchronous(function* ()
      {
         function* cycleSignState(_element, _target)
         {
            while (_element.html() !== _target)
            {
               yield sleep( Rand(30, 80) );
               Click(_element);
            }
         }
      
         if (iterations === 0)
         {
            Log('Applying search parameters with a standard of ' + lowerStandards);
         
            var priceSign = $("#prixCC");
            var priceValue = $("#prix[type='number']");
            
            var blupSign = $("#blupCC");
            var blupValue = $("#blup[type='number']");
            
            var submit = $("button[type='submit']");
            
            yield* cycleSignState(priceSign, '&lt;');
            
            priceValue.val(Math.min(500 + (lowerStandards * 500), (typeof args.maxPrice === N ? args.maxPrice : 7500)));
            blupValue.val( Math.max(90 - (lowerStandards * 10), -100));
            
            yield sleep( Rand(50, 150) );
            
            if (submit.length > 0)
            {
               coverPageArgSave();
               Click( submit.eq(0) );
            }
         }
         else if (iterations === 1)
         {
            Log('Sorting covers');
            
            var gpSort = e.find("thead").find("a:contains('Genetic potential')");
            
            if (gpSort.length > 0 && gpSort.find('img').length === 0)
            {
               coverPageArgSave();
               Click( gpSort.eq(0) );
            }
         }
         else
         {
            var rows = e.find("a.button[href*='/elevage/chevaux/saillie?offre=']");
            
            if (rows.length > 0){}
               Click( rows.eq(0) );
         }
      });
   }
   
   function AcceptCover(e)
   {
      var price = parseInt($("#page-contents").find("img.monnaie").parent().find("strong")
                     .last().html().replace(/ /g, ''));
      
      if (e.length > 0 && !isNaN(price) && Page.equus > price)
      {
         if (!PageArgs.sell)
            LeaveArgs.close = true;
         Click( e.eq(0) );
      }
      else if (Page.equus < price)
      {
         ObtainEquus(9000 - Page.equus);
         
         function waitForNewEquus()
         {
            Log('Equus: ' + Page.equus + ' Price: ' + price + ' Bran: ' + GetFlag('wheatbran'));
            if (Page.equus > price)
               AcceptCover(e);
            else if (GetFlag('wheatbran'))
               setTimeout(waitForNewEquus, 200);
            else
               Close();
         }
         
         waitForNewEquus();
      }
   }
   
   
   if (PageArgs.cover)
   {
      Wait("#errorsBox:visible", function()
      {
         KeepPageArgs();
         LeaveArgs.close = false;
         Back();
      }, false);
   
      if (URL.contains('/elevage/chevaux/saillie?offre='))
         Wait("#boutonDoReproduction", AcceptCover, true);
      else
         Cover();
   }
}

function M_SELL()
{
   Log('M_SELL module running');
   
   // Sell menu
   (function()
   {
      CalculatedPriceOptionsMenu();
      var columns = CreateMenuItem('Sell Options', 50, 25, 25);
      
      
   })();
   
   
   if (typeof PageArgs.sell === O)
   {
      var minDelay = 50, maxDelay = 300;
      
      var methods = $("#vendreCheval");
      if (methods.length === 0) return;
      
      Log('Method of sale: ' + PageArgs.sell.method);
      
      if (PageArgs.sell.method === 'direct')
         Click( methods.find("[id='vendreChevalVenteTypeDirect'][type='radio']").eq(0) );
      else if (PageArgs.sell.method === 'auction')
         Click( methods.find("[id='vendreChevalVenteTypeEnchere'][type='radio']").eq(0) );
      else if (PageArgs.sell.method === 'reserve')
         Click( methods.find("[id='vendreChevalVenteTypePrive'][type='radio']").eq(0) );
      
      function doSale()
      {
         if (PageArgs.sell.method === 'direct' && PageArgs.sell.equus >= 500 && PageArgs.sell.equus <= 1000000)
         {
            Wait("#directForm:visible", function(e)
            {
               synchronous(function* ()
               {
                  var parent = e.find("#venteBoxDirecte");
                  
                  if (parent.length > 0)
                  {
                     var equus = parent.find("#prixDirect");
                     var passes = parent.find("#vendreChevalPassDirect");
                     var negotiable = parent.find("#vendreChevalNegociable");
                     var submit = e.find("#vendreChevalSubmit");
                     
                     equus.val(PageArgs.sell.equus);
                     if (PageArgs.sell.passes && PageArgs.sell.passes > 0)
                        passes.val(PageArgs.sell.passes);
                     if (PageArgs.sell.negotiable)
                        negotiable.prop('checked', true);
                     
                     yield sleep( Rand(minDelay, maxDelay) );
                     
                     if (submit.length > 0)
                     {
                        LeaveArgs.close = true;
                        Click(submit);
                     }
                  }
               });
            }, true);
         }
         else if (PageArgs.sell.method === 'reserve' && typeof PageArgs.sell.player === S && PageArgs.sell.equus > 0)
         {
            Wait("#priveForm:visible", function()
            {
               synchronous(function* ()
               {
                  var player = e.find("#vendreChevalReservation");
                  var equus = e.find("#prixPrive");
                  var passes = e.find("#vendreChevalPassPrive");
                  var submit = e.find("#vendreChevalSubmit");
                  
                  player.val(PageArgs.sell.player);
                  equus.val( Math.max(500, PageArgs.sell.equus) );
                  if (PageArgs.sell.passes > 0)
                     passes.val(PageArgs.sell.passes);
                  
                  yield sleep( Rand(minDelay, maxDelay) );
                  
                  if (submit.length > 0)
                  {
                     if (PageArgs.auto)
                        LeaveArgs.close = true;
                     else
                        KeepPageArgs();
                     Click(submit);
                  }
               });
            }, true);
         }
      }
      
      setTimeout(doSale, Rand(minDelay, maxDelay));
   }
}

function M_SALES()
{
   Log('M_SALES module running');
   
   var columns = CreateMenuItem('Sales', 40, 25, 35);
   
   CreateButton(columns.a, 'Buy All', BuyAll);
   
   function overwriteBuyRedirection()  // An ingenious solution to ensuring that the page doesn't redirect
   {                                   // when a purchase is made, and it changes the colour of the bought row too
      var oldAjaxJSON = AjaxJSON;
      _overwritten = true;
      AjaxJSON = function(e)
      {
         if (e.page.indexOf('doAcheter') !== -1)
         {
            e.handleSuccess = function(arg)
            {
               if (arg !== '' && arg.length > 5)
               {
                  var button = $("button[onclick*='" + e.params + "']");
                  if (arg.indexOf('redirection') !== -1)
                     button.parents("tr").attr("style", "background-color: #cfc");
                  else
                     button.parents("tr").attr("style", "background-color: #fcc");
               }
            };
         }
         oldAjaxJSON(e);
      }
   }
   
   
   UW.eval('(function() {' + overwriteBuyRedirection.toString() + 'overwriteBuyRedirection(); })();');
   if (UW._overwritten)
      Log('AjaxJSON successfully overwritten ...');   // Take that Owlient

   function BuyAll()    // A simple function to buy all of the horses it can see, and refresh wanting more, hot stuff
   {
      synchronous(function* ()
      {
         var table = $("#vente-chevaux");
         var rows = table.find("button[id*='acheter'][onclick]").parents("tr");
         var minDelay = 250, maxDelay = 550;
         
         for (var i = rows.length - 1; i >= 0; i--)   // For some reason the list is reversed
         {
            var buyButton = rows.eq(i).find("button[id*='acheter'][onclick]");
            var price = parseInt(buyButton.parents("td").find("div[id*='prix-']").find("strong").html() || -1);
            
            if (price !== -1 && Page.equus > price && buyButton.length !== 0)
            {
               var oc = buyButton.attr("onclick");
               buyButton.attr("onclick", oc.substring(oc.indexOf('AjaxJSON'), oc.indexOf('}))')).trim() + '}));');
               Click(buyButton);
               
               yield sleep( Rand(minDelay, maxDelay) );
            }
         }
         
         if (rows.length > 0)
         {
            LeaveArgs.buyall = true;
            Reload(50);
         }
         else
            LeaveArgs.buyall = false;
      });
   }
   
   if (PageArgs.buyall) // It's like these functions just beg for innuendos. It's not my fault.
      BuyAll();
}

function M_STORE()
{
   Log('M_STORE module running');

   var columns = CreateMenuItem('Re-supply Setup', 34, 33, 33);
   
   CreateHeader(columns.a, 'Item lower limits:');
   CreateText(columns.a, 'Will attempt to buy the item if player inventory is below the item limit of that item.');
   CreateNewline(columns.a);
   CreateNewline(columns.a);
   
   columns.a.append('<table id="S_STORE_food" style="border: 0px;">' 
                  + '<tr><td></td><td style="padding-left: 10px;"></td></tr>'.repeat(5) + '</table>');
   columns.b.append('<table id="S_STORE_tack" style="border: 0px;">' 
                  + '<tr><td></td><td style="padding-left: 10px;"></td></tr>'.repeat(8) + '</table>');
   var foodTable = $("#S_STORE_food");
   var tackTable = $("#S_STORE_tack");
   var optionsList = [10, 50, 200, 500, 1000, 5000, 10000];
   var optionsListLower = [1, 5, 10, 25, 50];
   
   CreateCheckbox(foodTable.find('tr').eq(0).find('td').eq(0), 'Fodder', 'S_STORE_fodder', 0);
   CreateDropdown({
      elementAppendingTo   : foodTable.find('tr').eq(0).find('td').eq(1)
      ,text                : ''
      ,setting             : 'S_STORE_fodder_amount'
      ,def                 : 10000
      ,optionArray         : optionsList
   });
   
   CreateCheckbox(foodTable.find('tr').eq(1).find('td').eq(0), 'Oat', 'S_STORE_oat', 0);
   CreateDropdown({
      elementAppendingTo   : foodTable.find('tr').eq(1).find('td').eq(1)
      ,text                : ''
      ,setting             : 'S_STORE_oat_amount'
      ,def                 : 5000
      ,optionArray         : optionsList
   });
   
   CreateCheckbox(foodTable.find('tr').eq(2).find('td').eq(0), 'Carrot', 'S_STORE_carrot', 0);
   CreateDropdown({
      elementAppendingTo   : foodTable.find('tr').eq(2).find('td').eq(1)
      ,text                : ''
      ,setting             : 'S_STORE_carrot_amount'
      ,def                 : 500
      ,optionArray         : optionsList
   });
   
   CreateCheckbox(foodTable.find('tr').eq(3).find('td').eq(0), 'Mash', 'S_STORE_mash', 0);
   CreateDropdown({
      elementAppendingTo   : foodTable.find('tr').eq(3).find('td').eq(1)
      ,text                : ''
      ,setting             : 'S_STORE_mash_amount'
      ,def                 : 200
      ,optionArray         : optionsList
   });
   
   CreateCheckbox(foodTable.find('tr').eq(4).find('td').eq(0), 'Apple', 'S_STORE_apple', 0);
   CreateDropdown({
      elementAppendingTo   : foodTable.find('tr').eq(4).find('td').eq(1)
      ,text                : ''
      ,setting             : 'S_STORE_apple_amount'
      ,def                 : 50
      ,optionArray         : optionsList
   });
   
   CreateCheckbox(tackTable.find('tr').eq(0).find('td').eq(0), '1* Classical Saddle Cloth', 'S_STORE_1csc', 0);
   CreateDropdown({
      elementAppendingTo   : tackTable.find('tr').eq(0).find('td').eq(1)
      ,text                : ''
      ,setting             : 'S_STORE_1csc_amount'
      ,def                 : 10
      ,optionArray         : optionsListLower
   });
   
   CreateCheckbox(tackTable.find('tr').eq(1).find('td').eq(0), '1* Western Saddle Cloth', 'S_STORE_1wsc', 0);
   CreateDropdown({
      elementAppendingTo   : tackTable.find('tr').eq(1).find('td').eq(1)
      ,text                : ''
      ,setting             : 'S_STORE_1wsc_amount'
      ,def                 : 10
      ,optionArray         : optionsListLower
   });
   
   CreateCheckbox(tackTable.find('tr').eq(2).find('td').eq(0), '2** Classical Saddle', 'S_STORE_2cs', 0);
   CreateDropdown({
      elementAppendingTo   : tackTable.find('tr').eq(2).find('td').eq(1)
      ,text                : ''
      ,setting             : 'S_STORE_2cs_amount'
      ,def                 : 10
      ,optionArray         : optionsListLower
   });
   
   CreateCheckbox(tackTable.find('tr').eq(3).find('td').eq(0), '2** Western Saddle', 'S_STORE_2ws', 0);
   CreateDropdown({
      elementAppendingTo   : tackTable.find('tr').eq(3).find('td').eq(1)
      ,text                : ''
      ,setting             : 'S_STORE_2ws_amount'
      ,def                 : 10
      ,optionArray         : optionsListLower
   });
   
   CreateCheckbox(tackTable.find('tr').eq(4).find('td').eq(0), '2** Classical Bridle', 'S_STORE_2cb', 0);
   CreateDropdown({
      elementAppendingTo   : tackTable.find('tr').eq(4).find('td').eq(1)
      ,text                : ''
      ,setting             : 'S_STORE_2cb_amount'
      ,def                 : 10
      ,optionArray         : optionsListLower
   });
   
   CreateCheckbox(tackTable.find('tr').eq(5).find('td').eq(0), '2** Western Bridle', 'S_STORE_2wb', 0);
   CreateDropdown({
      elementAppendingTo   : tackTable.find('tr').eq(5).find('td').eq(1)
      ,text                : ''
      ,setting             : 'S_STORE_2wb_amount'
      ,def                 : 10
      ,optionArray         : optionsListLower
   });
   
   CreateCheckbox(tackTable.find('tr').eq(6).find('td').eq(0), '1* Polo Wraps', 'S_STORE_1pw', 0);
   CreateDropdown({
      elementAppendingTo   : tackTable.find('tr').eq(6).find('td').eq(1)
      ,text                : ''
      ,setting             : 'S_STORE_1pw_amount'
      ,def                 : 25
      ,optionArray         : optionsListLower
   });
   
   CreateCheckbox(tackTable.find('tr').eq(7).find('td').eq(0), '1* Ear Bonnet', 'S_STORE_1eb', 0);
   CreateDropdown({
      elementAppendingTo   : tackTable.find('tr').eq(7).find('td').eq(1)
      ,text                : ''
      ,setting             : 'S_STORE_1eb_amount'
      ,def                 : 25
      ,optionArray         : optionsListLower
   });
   
   CreateButton(columns.c, 'Replenish', Begin);
   
   
   var ownedItems = $("#inventaireContent").find("td").find("a[href*='?qName=']");
   var stockQueue = [];
   var tabElements = $("li[id*='tab-']");
   var tabs = [];
   var tabIndex = 0;
   
   for (var i = 1; i < tabElements.length; i++)
      tabs.push(tabElements.eq(i));
   
   function AddToBuyQueue(name, frenchName, id)
   {
      stockQueue.push({name: name, frenchName: frenchName, id: id});
   }
   
   function BuyStockIfNeeded(index)
   {
      if (index >= stockQueue.length)
      {
         for (var i = 0; i < tabs.length; i++)
         {
            if (!tabs[i].attr('class').contains('selected'))
            {
               Click($(tabs[i]).find("a.tab-action"));
               tabs.splice(i, 1);
               break;
            }
         }
         return;
      }
      
      var name = stockQueue[index].name;
      var frenchName = stockQueue[index].frenchName;
      var id = stockQueue[index].id;
      
      var itemStock = ownedItems.filter("[href$='?qName=" + frenchName + "']");
      var itemStockAmount = parseInt((itemStock.parent().find("span.value").html() || '').reg('[0-9]+')) || 0;
      var itemShopStock = $("#stock-" + id).find("strong").html();
      var itemShopStock = parseInt(itemShopStock === 'Infinite' ? '9999999999' : itemShopStock) || 0;
      var itemLimit = Math.max(PageArgs[name + 'Amount'] || 0, parseInt(Get('S_STORE_' + name + '_amount')));
      var itemToBuy = Math.min((itemLimit - itemStockAmount > 0 ? itemLimit - itemStockAmount : 0), itemShopStock);
      var itemPrice = parseInt($("#stock-" + id).parents("tr").find("img[alt='equus']").parent().find("strong").html());
      if (isNaN(itemPrice))
         itemPrice = 999999999;
      
      Log(name + ' itemShopStock: ' + itemShopStock + ' itemStockAmount: ' + itemStockAmount + ' itemToBuy: ' 
               + itemToBuy + ' itemPrice: ' + itemPrice + ' itemLimit: ' + itemLimit);
      
      if ((itemStock.length === 0 || itemStockAmount < itemLimit) && Page.equus > itemPrice * itemToBuy)
      {
         var menuOpen = $("button[type='submit'][onclick*='\"" + frenchName + "\"']");
         if (menuOpen.length > 0)
            Click(menuOpen);
         
         function waitForBoxOpen()
         {
            synchronous(function* ()
            {
               var _box = $("#produit" + id + "Box:visible");
               if (_box.length > 0)
               {
                  var options = $("#purchase" + id).find("option");
                  var lowest = {option: 1, diff: 999999999};
                  
                  for (var j = 0; j < options.length; j++)
                  {
                     var newDiff = Math.abs(itemToBuy - parseInt(options.eq(j).val()));
                     var optionVal = parseInt(options.eq(j).val());
                     if (itemToBuy == optionVal)
                     {
                        lowest.option = optionVal;
                        lowest.diff = 0;
                        break;
                     }
                     else if (newDiff < lowest.diff && optionVal + itemStockAmount > itemLimit)
                     {
                        lowest.option = optionVal;
                        lowest.diff = newDiff;
                     }
                  }
                  
                  if (Page.equus > itemPrice * lowest.option)
                  {
                     $("#purchase" + id).val(lowest.option);
                     yield sleep( Rand(10, 40) );
                     Click( $("#soumettre" + id) );
                  }
                  else
                     Click( _box.find("a.close-popup") );
                  
                  function checkForHidden()
                  {
                     if (_box.is(':hidden'))
                        BuyStockIfNeeded(++index);
                     else
                        setTimeout(checkForHidden, Rand(200, 500));
                  }
                  
                  checkForHidden();
               }
               else
               {
                  yield sleep(100);
                  waitForBoxOpen();
               }
            });
         }
         
         waitForBoxOpen();
      }
      else
         BuyStockIfNeeded(++index);
   }
   
   function CreateQueue()
   {
      stockQueue = [];
      var selectedTab = $("li[id*='tab-'].selected").attr('id');
      
      if (selectedTab.contains('alimentation'))
      {
         AddToBuyQueue('fodder', 'fourrage', 396);
         AddToBuyQueue('oat', 'avoine', 26);
         AddToBuyQueue('apple', 'pomme', 18);
         AddToBuyQueue('carrot', 'carotte', 19);
         AddToBuyQueue('mash', 'mash', 397);
      }
      else if (selectedTab.contains('equipement'))
      {
         AddToBuyQueue('1csc', 'tapis-classique-1x', 349);
         AddToBuyQueue('1wsc', 'tapis-western-1x', 350);
         AddToBuyQueue('2cs', 'selle-classique-2x', 147);
         AddToBuyQueue('2ws', 'selle-western-2x', 261);
         AddToBuyQueue('2cb', 'bride-classique-2x', 145);
         AddToBuyQueue('2wb', 'bride-western-2x', 262);
         AddToBuyQueue('1pw', 'bande-1x', 352);
         AddToBuyQueue('1eb', 'bonnet-1x', 351);
      }
      
      BuyStockIfNeeded(0);
   }
   
   function Begin()
   {
      Wait("#table-0", CreateQueue, false);
   }
   
   
   if (PageArgs.auto)
   {
      Begin();
      KeepPageArgs();
      Reload(120000);
   }
   
   
   // Log wheat bran
   (function()
   {
      var wheatBran = ownedItems.filter("[href*='son-ble']");
      var wheatBranStock = 0;
      
      if (wheatBran.length > 0)
         wheatBranStock = parseInt((wheatBran.parent().find("span.value").html() || '').reg('[0-9]+')) || 0;
      
      Set('wheatbran', wheatBranStock);
   })();
}

function M_STORE_SELL(e)
{
   Log('M_STORE_SELL module running');

   var columns = CreateMenuItem('Item-Selling Setup', 34, 33, 33);
   
   CreateButton(columns.a, 'Sell Wheat Bran', function() { PageArgs.equusNeeded = 9001; SellItem(); });
   CreateNewline(columns.a);
   CreateInputText({
      elementAppendingTo   : columns.a
      ,text                : 'Amount of wheat bran to keep'
      ,setting             : 'S_STORE_SELL_wheatmin'
      ,def                 : 100
      ,pattern             : 'number'
      ,size                : 5
   });
   
   function setDatabaseWheat(_stock)
   {
      Set('wheatbran', _stock > parseInt(Get('S_STORE_SELL_wheatmin', 100)));
   }
   
   
   if (typeof PageArgs.equusNeeded === N)
   {
      SellItem();
   }
   
   
   function SellItem()
   {
      var row = e.find("a[href='marche/voir?qName=son-ble']").parents('tr');
      var inStock = row.find("span[id*='inventaire']");
      var stock = parseInt((inStock.html() || '').replace(/ /g, '')) || 0;
      var button = row.find("button[id*='vendre']");
      
      setDatabaseWheat(stock);
      
      Log('Stock level of wheat bran: ' + stock);
      
      if (row.length > 0 && inStock.length > 0 && button.length > 0 && stock > parseInt(Get('S_STORE_SELL_wheatmin')))
      {
         Click( button.eq(0) );
         
         Wait("div.box[id*='produit']:visible", function(b)
         {
            Log('Sell box opened');
         
            var selection = b.find("select[id*='sale']");
            var submit = b.find("button[id*='soumettre']");
            
            var itemToSell = Math.max(9000 - Page.equus, PageArgs.equusNeeded);  // Doesn't take into account item price
            
            var options = selection.find("option");
            var lowest = {option: 1, diff: 999999999};
            
            for (var j = 0; j < options.length; j++)
            {
               var newDiff = Math.abs(itemToSell - parseInt(options.eq(j).val()));
               var optionVal = parseInt(options.eq(j).val());
               if (itemToSell == optionVal)
               {
                  lowest.option = optionVal;
                  lowest.diff = 0;
                  break;
               }
               else if (newDiff < lowest.diff && optionVal < stock)
               {
                  lowest.option = optionVal;
                  lowest.diff = newDiff;
               }
            }
            
            Log('Selling ' + lowest.option);
            
            selection.val( lowest.option );
            Click( submit.eq(0) );
            
            function checkIfSold()
            {
               if (parseInt(inStock.html().replace(/ /g, '')) === stock - lowest.option)
               {
                  setDatabaseWheat(stock - lowest.option);
                  Set('equus', parseInt(Get('equus', 0)) + lowest.option);
                  Close(1);
               }
               else
                  setTimeout(checkIfSold, 100);
            }
            
            checkIfSold();
         }, true);
      }
   }
}

function M_UFOCLICKER()
{
   Log('M_UFOCLICKER module running');
   
   setTimeout(clickUFO, Rand(300, 1800)); // Easy. After some random time, click the UFO
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* =========  H E L P E R   F U N C T I O N S  ========= */

function parseBool(s)   { return (typeof s === S && s === 'true') || (typeof s === N && s === 1); }
function Rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + (min > max ? max : min); }
function isNative(func) { return /^\s*function[^{]+{\s*\[native code\]\s*}\s*$/.test(func); }
function Kill(obj)      { if (obj.length !== 0) obj.remove(); }    // I swear I'm not violent
function Alert(s)       { alert(s); }  // Because I have a capitalisation fetish, among others
function Log(s, debug)
{
   var doLog = GM_getValue('CHIMERA_LOG') == 1 && (!debug || (debug && GM_getValue('CHIMERA_DEBUG') == 1));
   if (typeof s === O)
   {
      if (doLog)
         GM_log(s);
      if (s.toString() === '[object Object]' || s.length > 0)
      {
         var str = '';
         try {
            str = JSON.stringify(s);
         } catch(err) {
            Log('Logging error, typeof ' + (typeof s) + ' toString: ' + s.toString() + ' length: ' + s.length);
         }
         LogString += (LogString.length === 0 ? '' : '\n') + str;
      }
   }
   else
   {
      s = '(' + (now() - INIT) + 'ms)  ' + s;
      if (doLog)
         GM_log(s);
      LogString += (LogString.length === 0 ? '' : '\n') + s;
   }
}

function SendLog()
{
   
}

function synchronous(generator)
{
   var _generator = generator();
   function done()
   {
      var result = _generator.next().value;
      if (result instanceof Promise)
         result.then(done);
   }
   done();
}

function sleep(ms) { return new Promise(function(res, rej) { setTimeout(res, ms); }); }

function ObtainEquus(needed)
{
   var args = {
      date        : nowMS()
      ,arguments  : { equusNeeded: needed }
   };
   
   var urlToOpen = Page.url + '/marche/boutiqueVendre';
   var tab = GM_openInTab(urlToOpen, {active: false, insert: true});
   Set('window_args_' + urlToOpen, JSON.stringify(args));
}

function AddMenu(name, autoSelect)
{
   var nameL = name.toLowerCase().replace(/ /g, '');
   var first = $("#chimera_categories").find("li").length > 0 ? 'class="nonfirst"' : '';
   var getSelected = $("#chimera_categories").find("#selected").eq(0);
   var doAsSelected = (typeof autoSelect === B ? autoSelect : getSelected.length === 0);
   var selected = doAsSelected ? 'id="selected"' : '';
   
   if ( getSelected.attr('name') === 'globaloptions' && nameL !== 'globaloptions' && autoSelect !== false)
   {
      getSelected.removeAttr('id');
      $("#globaloptions_content").hide();
      return AddMenu(name, autoSelect);
   }
   
   $("#chimera_categories ul").append('<li ' + selected + ' name="' + nameL + '" ' + first + '>' + name + '</li>');
   $("#chimera_content").append('<div id="' + nameL + '_content" class="chimera_category_content" name="' + nameL
                                + '" style="display: ' + (doAsSelected ? 'block' : 'none')
                                + ';"></div>');
   
   $("#chimera_categories").find("li").click(function()
   {
      $("#chimera_categories").find("li").attr("id", "nonselected");
      $("div.chimera_category_content").hide();
      
      $(this).attr("id", "selected");
      $("div.chimera_category_content[name='" + $(this).attr("name") + "']").show();
   });
   
   return $("#" + nameL + "_content");
}

function CreateMenuItem(n, a, b, c, d, _select)
{
   _select = typeof d === B ? d : _select;
   var entryPoint = AddMenu(n, _select), columns = {};
   if (typeof a === N)
   {
      entryPoint.append('<div id="colA" style="width: ' + a + '%;" class="chimera_menu_column"></div>');
      columns.a = entryPoint.find("#colA");
   }
   if (typeof b === N)
   {
      entryPoint.append('<div id="colB" style="width: ' + b + '%;" class="chimera_menu_column"></div>');
      columns.b = entryPoint.find("#colB");
   }
   if (typeof c === N)
   {
      entryPoint.append('<div id="colC" style="width: ' + c + '%;" class="chimera_menu_column"></div>');
      columns.c = entryPoint.find("#colC");
   }
   if (typeof d === N)
   {
      entryPoint.append('<div id="colD" style="width: ' + d + '%;" class="chimera_menu_column"></div>');
      columns.d = entryPoint.find("#colD");
   }
   return columns;
}

function CreateCheckbox(obj, text, setting, def)
{
   var checked = GetFlag(setting, def) ? 'checked=checked' : '';
   obj.append('<label class="chimera_text" for="' + setting + '_checkbox"><input class="chimera_checkbox" '
               + 'type="checkbox" id="' + setting + '_checkbox" ' + checked + '/></input> ' + text + '</label>');
   
   var checkbox = obj.parent().find('#' + setting + '_checkbox');
   checkbox.on("change", function()
   {
      if (checkbox[0].checked) 	Set(setting, 1);
      else                       Set(setting, 0);
      Log(setting + ' checkbox changed to ' + Get(setting), true);
   });
}

function CreateCheckboxPageArg(obj, text, name, arg)
{
   var checked = PageArgs[arg] ? 'checked=checked' : '';
   obj.append('<input class="chimera_checkbox" type="checkbox" id="' + name + '_checkboxpa" ' + checked + '/></input>');
   obj.append('<label class="chimera_text" for="' + name + '_checkboxpa"> ' + text + '</label>');
   
   var checkbox = obj.parent().find('#' + name + '_checkboxpa');
   checkbox.on("change", function()
   {
      PageArgs[arg] = checkbox.prop('checked');
      Log(name + ' checkbox type page arg is now ' + PageArgs[arg], true);
   });
}

function CreateButton(obj, text, func)
{
   var textL = text.toLowerCase().replace(/ |,|\+|\=|\)|\(|\*/g, '');
   obj.append('<span class="chimera_button" id="' + textL + '_button">' + text + '</span>');
   var button = obj.parent().find('#' + textL + '_button');
   button.on("click", func);
   return button;
}

function CreateText(obj, text, id)
{
   id = (typeof id === U ? '' : 'id="' + id + '"');
   obj.append('<span class="chimera_text" ' + id + '>' + text.trim() + '</span>');
}

function CreateHeader(obj, text)
{
   obj.append('<h2 class="chimera_header">' + text.trim() + '</h2>');
}

function CreateDropdown(o)
{
   for (var i = 0; i < o.optionArray.length; i++)
      o.optionArray[i] = typeof o.optionArray[i] === S ? o.optionArray[i] : o.optionArray[i].toString();
      
   var obj = o.elementAppendingTo;
   if (o.text !== '')
      obj.append('<span class="chimera_text">' + o.text + '</span> ');
   obj.append('<select id="' + o.setting + '_dropdown"></select>');
   var dropdown = obj.parent().find('#' + o.setting + '_dropdown');
   var currVal = Get(o.setting, o.def) || o.defs;
   
   if (typeof o.def !== U && typeof o.optionArray !== U && o.optionArray.indexOf(o.def) === -1)
      o.optionArray.unshift(o.def);
   
   if (typeof currVal !== U && o.optionArray.indexOf(currVal) === -1)
      o.optionArray.unshift(currVal);
   
   for (var i = 0; i < o.optionArray.length; i++)
      dropdown.append('<option>' + o.optionArray[i] + '</option>');
   
   dropdown.val(currVal);
   
   dropdown.on("change", function()
   {
      Set(o.setting, dropdown.val());
   });
}

function CreateInputText(o)
{
   var obj = o.elementAppendingTo;
   var val = Get(o.setting, o.def ? o.def : '');
   var text = o.text ? ('<span class="chimera_text">' + o.text + '</span>') : '';
   
   var elementCode = (o.before ? text : '') + '<input type="text" id="' + o.setting + '_value" value="' + val 
                     + '" size="' + o.size + '" style="margin-right: 3px;"></input>' + (!o.before ? text : '');
   
   obj.append(elementCode);
   
   var inputText = obj.parent().find('#' + o.setting + '_value');
   inputText.on("change", function()
   {
      var sanitised = inputText.val();
      if (o.pattern)
         sanitised = o.pattern === 'trim' ? o.pattern.trim() : sanitised.reg(getPresetRegex(o.pattern));
      Set(o.setting, typeof sanitised === S && sanitised !== null ? sanitised : '');
   });
}

function CreateNewline(obj, count)
{
   count = typeof count === N ? count : 1;
   obj.append('<br class="chimera">'.repeat(count));
}

function CreateSpacer(obj)
{
   obj.append('<br><hr><br>');
}

function getPresetRegex(s)
{
   if (s === 'number')
      return '[0-9]+';
   else if (s === 'decimal')
      return '[0-9]+.[0-9]+';
}

function drawMarker(size, colour, obj)
{
   var halfSize = parseInt(size / 2);
   $("body").append('<div style="top: ' + (obj.y - halfSize) + 'px; left: ' + (obj.x - halfSize) + 'px; width: ' + size + 'px; height: ' + size + 'px; background-color: ' + colour + '; position: absolute; z-index: 9999;"></div>');
}

function now() { return (new Date()); }

function nowMS() { return now().getTime(); }

function date()
{
   var d = new Date();
   return d.getHours() + '.' + ('0' + d.getMinutes()).slice(-2) + '  ' + d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
}

function convertUSDate(t)
{
   var d = t.date.split(/-|:| |\//);
   return (new Date(d[2], d[0] - 1, d[1], d[3], d[4], 0, 0))
} 

function convertUKDate(t)
{
   var d = t.date.split(/-|:| |\//);
   return (new Date(d[2], d[1] - 1, d[0], d[3], d[4], 0, 0))
}

function convertINTDate(t)
{
   var d = t.date.split(/-|:| |\//);
   return (new Date(d[0], d[1] - 1, d[2], d[3], d[4], 0, 0))
}

function isolate(array, term)
{
   for (var i = 0, temp = []; i < array.length; i++) { if (array[i].indexOf(term) != -1) temp.push(array[i]); }
   return temp;
}

function Reload(t)
{
   if (typeof t !== N) document.location.reload();
   else                setTimeout(function() { document.location.reload(); }, t);
}

function CheckAJAXCompetion(searchUrl, searchData)
{
   for (var i = AJAX.length - 1; i >= 0; i--)
   {
      // If the request we want has indeed gone through successfully, set the response
      if  (AJAX[i].url.contains(searchUrl) && (typeof searchData !== U || AJAX[i].data.contains(searchData)))
         return AJAX[i].response;
   }
   return null;
}

function Back()
{
   window.history.back();
}

function Close()
{
   Log('CLOSE CALLED: ' + isUFO());
   if (!isUFO())
   {
      window.close();
      setTimeout(Close, 250);
   }
   else
   {
      clickUFO();
      // TODO: find a way to work out once the UFO has been clicked
      setTimeout(Close, 5000);
   }
}

function CheckForClose()
{
   if (typeof PageArgs.close === B && PageArgs.close)
      Close();
   else if (typeof PageArgs.close === N && PageArgs.close > 0)
      setTimeout(Close, PageArgs.close);
}

function Set(name, val)
{
   if (val.length < 100 && name !== 'lastID' && name !== 'uc' && name !== 'ud')
      Log('[Set]  Setting the database value ' + name + ' to "' + val + '"', true);
   var o = GM_getValue(name);
   if (typeof o === U || o === null || o !== val)
      GM_setValue(name, val.toString());
}

function Get(name, def)
{
   var v = GM_getValue(name);
   if (typeof v !== U)
      return v;
   else
   {
      if (typeof def !== U)   { Set(name, def.toString()); return def.toString(); }
      else                    return null;
   }
}

function GetFlag(name, def)
{
   if (typeof def === U || def === null)
      def = 0;
   var n = Get(name, def);
   return n == 1 || n === 'true';
}

function Delete(n)
{
   if (typeof n === S && n !== '')
   {
      GM_deleteValue(n);
      Log('Deleting GM database value with name "' + n + '"', true);
   }
}

function KeepPageArgs()
{
   $.extend(LeaveArgs, PageArgs);
}

function isUFO()
{
   var ufo = $("div[id*='Ufo_']");
   return (ufo.length > 0 && ufo.is(":visible"));
}

function clickUFO()
{
   var ufo = $("div[id*='Ufo_']");
   if (ufo.length > 0 && ufo.css('display') !== 'none')
      Click(ufo);
}

function checkWeight()
{
   var w = $("#feeding").find("#messageBoxInline");
   if (w.length > 0)
   {
      if (w.eq(0).html().contains("too fat"))       return "f";
      if (w.eq(0).html().contains("underweight"))   return "s";
   }
   //Log("[checkWeight]  w is 0-length", true);
   return "n";
}

function getServer()
{
   if (document.location.host == 'au.howrse.com')          return 'AU';
   else if (document.location.host == 'www.howrse.com')    return 'INT';
   else if (document.location.host == 'www.howrse.co.uk')  return 'UK';
   else if (document.location.host == 'us.howrse.com')     return 'US';
   else if (document.location.host == 'ca.howrse.com')     return 'CA';
}

function currentOpenTabsInTabArray(_openPageList)
{
   var tempArray = [];
   for (var i = 0; i < _openPageList.length; i++)
   {
      if (typeof _openPageList[i].closed === B)
      {
         if (!_openPageList[i].closed)
            tempArray.push(_openPageList[i]);
      }
   }
   return tempArray;
}

function regainPotential(projectedEnergy, projectedTimeLeft) 
{
   var e = 0, l = 0, s = '';
   if (typeof projectedTimeLeft === U)  projectedTimeLeft = H.timeLeft;
   if (projectedEnergy > 20) return { energy: 0, len: 0 };
   
   if (H.actionsAvailable.stroke && projectedTimeLeft - (l * 60) > 30)
   {
      var gain = (100 - projectedEnergy) * 0.12;
      e += gain;   // Rainbow bonus?
      l += 0.5;
   }
   if (H.actionsAvailable.drink && projectedTimeLeft - (l * 60) > 15)
   {
      var gain = (H.trough ? 8 : 2) * (H.fountain ? 3 : 1);
      e += gain;
      l += 0.25;
   }
   if (H.actionsAvailable.carrot && projectedTimeLeft - (l * 60) > 15)
   {
      e += 8;
      l += 0.25;
   }
   if (H.actionsAvailable.mash && H.age >= 24 && H.energy < 20 && projectedTimeLeft - (l * 60) > 30)
   {
      e += 10;
      l += 0.5;
   }
   if (H.fodderNeeded > 0 || H.oatsNeeded > 0 && projectedTimeLeft - (l * 60) > 30)
   {
      var energieGain = Math.pow(1 + 1 / 100, H.fodderNeeded) * Math.pow(1 + 1.5 / 100, H.oatsNeeded);
      var totalEnergie = Math.max((projectedEnergy + e) * (energieGain - 1), 0);
      var gain = Math.min(totalEnergie, 100 - H.energy);
      e += gain;
      l += 0.5;
   }
   return { energy: e, len: l * 60 };
}

function getFrenchSkillName(_skill)
{
   if (_skill === 'st') return 'endurance';
   if (_skill === 'sp') return 'vitesse';
   if (_skill === 'dr') return 'dressage';
   if (_skill === 'ga') return 'galop';
   if (_skill === 'tr') return 'trot';
   if (_skill === 'ju') return 'saut';
}

function Click(element)
{
   if (typeof element === U) return;
   element = $(element).eq(0);
   if (element.length === 0) return;

   var elementSize = {
      width    : element.width()
      ,height  : element.height()
   };

   var clickPoint = {
      x  : parseInt(element.offset().left + Rand(2, elementSize.width - 2))
      ,y : parseInt(element.offset().top + Rand(2, elementSize.height - 2))
   };
   
   var e = document.createEvent("MouseEvents");
   e.initMouseEvent('click', true, true, UW, 1, clickPoint.x, clickPoint.y, clickPoint.x, clickPoint.y
                    , false, false, false, false, 0, null);
   element[0].dispatchEvent(e);
}

function ActionClick(element)
{
   if (typeof element === U) return;
   element = $(element);
   if (element.length == 0) return;

   var centerOfScreen = {
      x  : parseInt(window.innerWidth / 2)
      ,y : parseInt(window.innerHeight / 2)
   };

   var elementSize = {
      width    : element.width()
      ,height  : element.height()
   };

   var clickPoint = {
      x  : parseInt(element.offset().left + Rand(1, elementSize.width - 1))
      ,y : parseInt(element.offset().top + Rand(1, elementSize.height - 1))
   };

   function calcualteNodePath(_from, _to)
   {
      var path = [];
      function plotLine(x0, y0, x1, y1)
      {
         var dx =  Math.abs(x1-x0), sx = x0<x1 ? 1 : -1, dy = -Math.abs(y1-y0), sy = y0<y1 ? 1 : -1;
         var err = dx + dy, e2;                                 /* error value e_xy */
         for (;;){                                                          /* loop */
            path.push({x: x0, y: y0});
            if (x0 == x1 && y0 == y1) break;
            e2 = 2*err;
            if (e2 >= dy) { err += dy; x0 += sx; }                        /* x step */
            if (e2 <= dx) { err += dx; y0 += sy; }                        /* y step */
         }
      }
      function plotQuadBezierSeg(x0, y0, x1, y1, x2, y2, dir)
      {                                  /* plot a limited quadratic Bezier segment */
         function _done(_d, _a) { if (_d) path = path.concat(_a.reverse()); else path = path.concat(_a); }
         var sx = x2-x1, sy = y2-y1, newArr = [];
         var xx = x0-x1, yy = y0-y1, xy;              /* relative values for checks */
         var dx, dy, err, cur = xx*sy-yy*sx;                           /* curvature */
         if (sx*sx+sy*sy > xx*xx+yy*yy) {                /* begin with shorter part */
          x2 = x0; x0 = sx+x1; y2 = y0; y0 = sy+y1; cur = -cur;       /* swap P0 P2 */
         }
         if (cur != 0) {                                        /* no straight line */
          xx += sx; xx *= sx = x0 < x2 ? 1 : -1;                /* x step direction */
          yy += sy; yy *= sy = y0 < y2 ? 1 : -1;                /* y step direction */
          xy = 2*xx*yy; xx *= xx; yy *= yy;               /* differences 2nd degree */
          if (cur*sx*sy < 0) {                                /* negated curvature? */
            xx = -xx; yy = -yy; xy = -xy; cur = -cur;
          }
          dx = 4.0*sy*cur*(x1-x0)+xx-xy;                  /* differences 1st degree */
          dy = 4.0*sx*cur*(y0-y1)+yy-xy;
          xx += xx; yy += yy; err = dx+dy+xy;                     /* error 1st step */
          do {
            newArr.push({x: x0, y: y0});
            if (x0 == x2 && y0 == y2) { _done(dir, newArr); return; } /* curve done */
            y1 = 2*err < dx;                       /* save value for test of y step */
            if (2*err > dy) { x0 += sx; dx -= xy; err += dy += yy; }      /* x step */
            if (    y1    ) { y0 += sy; dy -= xy; err += dx += xx; }      /* y step */
          } while (dy < 0 && dx > 0);        /* gradient negates -> algorithm fails */
         }
         _done(dir, newArr); plotLine(x0,y0, x2,y2);  /* plot remaining part to end */
      }
      function plotQuadBezier(x0, y0, x1, y1, x2, y2)
      {                                          /* plot any quadratic Bezier curve */
         var x = x0-x1, y = y0-y1, t = x0-2*x1+x2, r;
         if (x*(x2-x1) > 0) {                              /* horizontal cut at P4? */
            if (y*(y2-y1) > 0)                           /* vertical cut at P6 too? */
               if (Math.abs((y0-2*y1+y2)/t*x) > Math.abs(y)) {      /* which first? */
                  x0 = x2; x2 = x+x1; y0 = y2; y2 = y+y1;            /* swap points */
               }                            /* now horizontal cut at P4 comes first */
            t = (x0-x1)/t;
            r = (1-t)*((1-t)*y0+2.0*t*y1)+t*t*y2;                       /* By(t=P4) */
            t = (x0*x2-x1*x1)*t/(x0-x1);                       /* gradient dP4/dx=0 */
            x = Math.floor(t+0.5); y = Math.floor(r+0.5);
            r = (y1-y0)*(t-x0)/(x1-x0)+y0;                  /* intersect P3 | P0 P1 */
            plotQuadBezierSeg(x0,y0, x,Math.floor(r+0.5), x,y, false);
            r = (y1-y2)*(t-x2)/(x1-x2)+y2;                  /* intersect P4 | P1 P2 */
            x0 = x1 = x; y0 = y; y1 = Math.floor(r+0.5);        /* P0 = P4, P1 = P8 */
         }
         if ((y0-y1)*(y2-y1) > 0) {                          /* vertical cut at P6? */
            t = y0-2*y1+y2; t = (y0-y1)/t;
            r = (1-t)*((1-t)*x0+2.0*t*x1)+t*t*x2;                       /* Bx(t=P6) */
            t = (y0*y2-y1*y1)*t/(y0-y1);                       /* gradient dP6/dy=0 */
            x = Math.floor(r+0.5); y = Math.floor(t+0.5);
            r = (x1-x0)*(t-y0)/(y1-y0)+x0;                  /* intersect P6 | P0 P1 */
            plotQuadBezierSeg(x0,y0, Math.floor(r+0.5),y, x,y, false);
            r = (x1-x2)*(t-y2)/(y1-y2)+x2;                  /* intersect P7 | P1 P2 */
            x0 = x; x1 = Math.floor(r+0.5); y0 = y1 = y;        /* P0 = P6, P1 = P7 */
         }
         plotQuadBezierSeg(x0, y0, x1, y1, x2, y2, true);               /* remaining part */
      }
      var cx = (_from.x + _to.x) / 2, cy = (_from.y + _to.y) / 2;
      var dx = (_to.x - _from.x) / 4, dy = (_to.y - _from.y) / 4;
      var perp = Rand(1, 2) == 1 ? { x: cx - dy, y: cy + dx } : { x: cx + dy, y: cy - dx };
      plotQuadBezier(_from.x, _from.y, perp.x, perp.y, _to.x, _to.y);
      return path;
   }
   function _event(_element, _type, _detail, c)
   {
      if (typeof _element === U || typeof _type === U || typeof _detail === U || typeof c === U)
      {
         Log('[_event] _element, _type, _detail, or c is undefined ' + _element + ' ' + _type + ' ' + _detail + ' ' + c);
         return;
      }
      var e = document.createEvent("MouseEvents");
      e.initMouseEvent(_type, true, true, window, _detail, c.x, c.y, c.x, c.y, false, false, false, false, 0, null);
      if (_element.length == 0 || typeof _element[0] === U)
      {
         Log('[_event] _element.length is 0 or _element[0] is undefined ' + _element);
         return;
      }
      _element[0].dispatchEvent(e);
   }
   function isTopValid(_top, _target)  { return (_top[0] == _target[0] || $.contains(_target, _top)); }

   var nodes = calcualteNodePath(lastClickedElement.coords, clickPoint);
   var hasClicked = false, _topElement = null, _lastElement = null;
   drawMarker(10, 'red', clickPoint);
   GM_log(nodes);
   
   // Don't include the chimera menu

   for (var i = 0; i < nodes.length; i++)
   {
      drawMarker(1, 'blue', nodes[i]);
      _topElement = $(document.elementFromPoint(nodes[i].x, nodes[i].y));

      _event($(document), 'mousemove', 0, nodes[i]);
      _event(_topElement, 'mousemove', 0, nodes[i]);

      if (!_topElement.data("enter"))
         _event(_topElement, 'mouseenter', 0, nodes[i]);
      //if (!_topElement.data("over")) // incorrect behaviour
      // _event(_topElement, 'mouseover', 0, nodes[i]);
      if (!_lastElement.data("out") && _lastElement[0] != _topElement[0])
         _event(_lastElement, 'mouseout', 0, nodes[i]);
      if (!_lastElement.data("leave") && _lastElement[0] != _topElement[0])
         _event(_lastElement, 'mouseleave', 0, nodes[i]);

      if (isTopValid(element, _topElement) && !hasClicked)
      {
         if (nodes[i].x == clickPoint.x && nodes[i].y == clickPoint.y)
         {
            _event(_topElement, 'mousedown', 0, clickPoint);
            _event(_topElement, 'click', 1, clickPoint);
            _event(_topElement, 'mouseup', 0, clickPoint);
            lastClickedElement.element = _topElement;
            lastClickedElement.coords = clickPoint;
            hasClicked = true;
         }
      }
      _lastElement = _topElement;
   }
}

function hasBMI(t) { return $("#objects-body-content").find("a[href*='" + t + "']").length !== 0; }

function getSpecies(html)
{
   html = html || $("body");
   var s = (html.find("#characteristics-body-content strong:contains('Species:')").parent().html() || '');
   if (s.contains('Horse'))              return {type: 'Horse',     species: 'Horse'};
   else if (s.contains('Pony'))          return {type: 'Pony',      species: 'Pony'};
   else if (s.contains('Pegasus'))       return {type: 'Horse',     species: 'Pegasus'};
   else if (s.contains('Unicorn'))       return {type: 'Unicorn',   species: 'Unicorn'};
   else if (s.contains('Divine'))        return {type: 'Divine',    species: 'Divine'};
   else if (s.contains('Winged U'))      return {type: 'Unicorn',   species: 'Winged Unicorn'};
   return {};
}

function getBreed()
{
   var _b = ($("#characteristics-body-content a[href*='/dossiers/race?']").html() || '').replace(/ /g, "");
   return _b != '' ? _b : null;
}

function checkCoatRarity()
{
   var coat = ($("#characteristics-body-content strong:contains('Coat:')").parent().html() || '')
               .replace('<strong>Coat:</strong>', '').replace(' ', '').trim();
   if (coat === '')
      return {name: null, rarity: null};
   
   if (H.breed == "Akhal-Teke")
   {
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 1};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 1};
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 2};
      if (coat == 'Mouse Grey')                    return {name: 'Mouse Grey',         rarity: 2};
      if (coat == 'Black')                         return {name: 'Black',              rarity: 3};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 3};
      if (coat == 'Light Grey')                    return {name: 'Light Grey',         rarity: 5};
   }
   else if (H.breed == "Appaloosa")
   {
      if (coat == 'Black')                         return {name: 'Black',              rarity: 1};
      if (coat == 'Black Snowflake')               return {name: 'Black Snowflake',    rarity: 1};
      if (coat == 'Few Spots')                     return {name: 'Few Spots',          rarity: 1};
      if (coat == 'Dun Spotted Blanket')           return {name: 'Dun Spot. Blanket',  rarity: 2};
      if (coat == 'Palomino Spotted Blanket')      return {name: 'Pal. Spot. Blank.',  rarity: 2};
      if (coat == 'Black Spotted Blanket')         return {name: 'Blk. Spot. Blank.',  rarity: 3};
      if (coat == 'Chestnut Snowflake')            return {name: 'Chstnt. Snowflake',  rarity: 3};
      if (coat == 'Dun Blanket')                   return {name: 'Dun Blanket',        rarity: 3};
      if (coat == 'Bay Snowflake')                 return {name: 'Bay Snowflake',      rarity: 4};
   }
   else if (H.breed == "ArabianHorse")
   {
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 1};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 1};
      if (coat == 'Mouse Grey')                    return {name: 'Mouse Grey',         rarity: 1};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 2};
      if (coat == 'Black')                         return {name: 'Black',              rarity: 4};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 4};
      if (coat == 'Cherry bay')                    return {name: 'Cherry Bay',         rarity: 5};
   }
   else if (H.breed == "ArgentineanCriollo")
   {
      if (coat == 'Black Spotted Blanket')         return {name: 'Blk. Spot. Blank.',  rarity: 1};
      if (coat == 'Black Tobiano')                 return {name: 'Black Tobiano',      rarity: 1};
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 1};
      if (coat == 'Light Grey')                    return {name: 'Light Grey',         rarity: 1};
      if (coat == 'Bay Spotted Blanket')           return {name: 'Bay Spot. Blanket',  rarity: 2};
      if (coat == 'Chestnut Tobiano')              return {name: 'Chestnut Tobiano',   rarity: 2};
      if (coat == 'Dapple Grey')                   return {name: 'Dapple Grey',        rarity: 2};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 2};
      if (coat == 'Bay Tobiano')                   return {name: 'Bay Tobiano',        rarity: 3};
      if (coat == 'Mouse Grey')                    return {name: 'Mouse Grey',         rarity: 3};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 5};
   }
   else if (H.breed == "AustralianPony")
   {
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 1};
      if (coat == 'Fleabitten Gray')               return {name: 'Fleabitten Gray',    rarity: 1};
      if (coat == 'Mouse Gray')                    return {name: 'Mouse Gray',         rarity: 1};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 1};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 1};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 2};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 3};
      if (coat == 'Cherry bay')                    return {name: 'Cherry Bay',         rarity: 4};
      if (coat == 'Dark Bay')                      return {name: 'Dark Bay',           rarity: 4};
      if (coat == 'Black')                         return {name: 'Black',              rarity: 5};
   }
   else if (H.breed == "Barb")
   {
      if (coat == 'Mouse Gray')                    return {name: 'Mouse Gray',         rarity: 2};
      if (coat == 'Flaxen Chestnut')               return {name: 'Flaxen Chestnut',    rarity: 4};
      if (coat == 'Liver chestnut')                return {name: 'Liver Chestnut',     rarity: 4};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 5};
   }
   else if (H.breed == "Brumby")
   {
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Fleabitten Gray')               return {name: 'Fleabitten Gray',    rarity: 1};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 2};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 2};
      if (coat == 'Flaxen Chestnut')               return {name: 'Flaxen Chestnut',    rarity: 3};
      if (coat == 'Mouse Gray')                    return {name: 'Mouse Gray',         rarity: 4};
      if (coat == 'Black')                         return {name: 'Black',              rarity: 5};
   }
   else if (H.breed == "Canadianhorse")
   {
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 1};
      if (coat == 'Chestnut')                      return {name: 'Chestnut',           rarity: 3};
   }
   else if (H.breed == "ChincoteaguePony")
   {
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 1};
      if (coat == 'Fleabitten Gray')               return {name: 'Fleabitten Gray',    rarity: 1};
      if (coat == 'Black Overo')                   return {name: 'Black Overo',        rarity: 2};
      if (coat == 'Black Tobiano')                 return {name: 'Black Tobiano',      rarity: 2};
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 2};
      if (coat == 'Dark bay Tobiano')              return {name: 'Dark Bay Tobiano',   rarity: 2};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 2};
      if (coat == 'Light Gray')                    return {name: 'Light Gray',         rarity: 2};
      if (coat == 'Palomino Tobiano')              return {name: 'Palomino Tobiano',   rarity: 2};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 2};
      if (coat == 'Dapple gray Tobiano')           return {name: 'Dapple G. Tobiano',  rarity: 3};
      if (coat == 'Liver chestnut Tobiano')        return {name: 'Lvr. Chstnt. Tob.',  rarity: 3};
      if (coat == 'Mouse Gray')                    return {name: 'Mouse Gray',         rarity: 3};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 3};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 3};
      if (coat == 'Bay Tobiano')                   return {name: 'Bay Tobiano',        rarity: 4};
      if (coat == 'Chestnut Tobiano')              return {name: 'Chestnut Tobiano',   rarity: 4};
      if (coat == 'Dapple Gray')                   return {name: 'Dapple Gray',        rarity: 5};
   }
   else if (H.breed == "Connemara")
   {
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 1};
      if (coat == 'Fleabitten Grey')               return {name: 'Fleabitten Grey',    rarity: 1};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 1};
      if (coat == 'Mouse Grey')                    return {name: 'Mouse Grey',         rarity: 2};
      if (coat == 'Black')                         return {name: 'Black',              rarity: 3};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 4};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 4};
   }
   else if (H.breed == "Curly")
   {
      if (coat == 'Dun Tobiano')                   return {name: 'Dun Tobiano',        rarity: 1};
      if (coat == 'Mouse grey Tobiano')            return {name: 'Mouse G. Tobiano',   rarity: 1};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 1};
      if (coat == 'Palomino Tobiano')              return {name: 'Palomino Tobiano',   rarity: 1};
      if (coat == 'Black Tobiano')                 return {name: 'Black Tobiano',      rarity: 2};
      if (coat == 'Cherry bay Tobiano')            return {name: 'Chry. Bay Tobiano',  rarity: 2};
      if (coat == 'Dapple grey Tobiano')           return {name: 'Dpl. G. Tobiano',    rarity: 2};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 3};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 3};
      if (coat == 'Liver chestnut Tobiano')        return {name: 'Lvr. Chstnt. Tob.',  rarity: 3};
      if (coat == 'Mouse Grey')                    return {name: 'Mouse Grey',         rarity: 3};
      if (coat == 'Bay Tobiano')                   return {name: 'Bay Tobiano',        rarity: 4};
      if (coat == 'Black')                         return {name: 'Black',              rarity: 4};
      if (coat == 'Cherry bay')                    return {name: 'Cherry Bay',         rarity: 4};
      if (coat == 'Chestnut Tobiano')              return {name: 'Chestnut Tobiano',   rarity: 5};
      if (coat == 'Dapple Grey')                   return {name: 'Dapple Grey',        rarity: 5};
      if (coat == 'Flaxen Chestnut')               return {name: 'Flaxen Chestnut',    rarity: 5};
   }
   else if (H.breed == "Fjord")
   {
      if (coat == 'Gulblakk')                      return {name: 'Gulblakk',           rarity: 1};
      if (coat == 'Ulsblakk')                      return {name: 'Ulsblakk',           rarity: 2};
      if (coat == 'Gra')                           return {name: 'Gra',                rarity: 3};
      if (coat == 'Rodblakk')                      return {name: 'Rodblakk',           rarity: 4};
   }
   else if (H.breed == "FrenchTrotter")
   {
      if (coat == 'Dapple Grey')                   return {name: 'Dapple Grey',        rarity: 2};
      if (coat == 'Flaxen Chestnut')               return {name: 'Flaxen L. Chstnt.',  rarity: 5};
   }
   else if (H.breed == "GypsyVanner")
   {
      if (coat == 'Mouse Grey')                    return {name: 'Mouse Grey',         rarity: 1};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 1};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 2};
      if (coat == 'Bay')                           return {name: 'Bay',                rarity: 3};
      if (coat == 'Chestnut')                      return {name: 'Chestnut',           rarity: 3};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 3};
      if (coat == 'Cherry bay Tobiano')            return {name: 'Chry. Bay Tobiano',  rarity: 5};
      if (coat == 'Dapple grey Tobiano')           return {name: 'Dpl. Grey Tobiano',  rarity: 5};
      if (coat == 'Dun Tobiano')                   return {name: 'Dun Tobiano',        rarity: 5};
      if (coat == 'Liver chestnut Tobiano')        return {name: 'Lvr. Chstnt. Tob.',  rarity: 5};
      if (coat == 'Mouse grey Tobiano')            return {name: 'Mouse Gr. Tobiano',  rarity: 5};
      if (coat == 'Palomino Tobiano')              return {name: 'Palomino Tobiano',   rarity: 5};
   }
   else if (H.breed == "Hackney")
   {
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 1};
      if (coat == 'Light Gray')                    return {name: 'Light Gray',         rarity: 1};
      if (coat == 'Flaxen Chestnut')               return {name: 'Flaxen Chestnut',    rarity: 2};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 2};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 3};
   }
   else if (H.breed == "Hanoverian")
   {
      if (coat == 'Mouse Gray')                    return {name: 'Mouse Gray',         rarity: 1};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 1};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 2};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 5};
      if (coat == 'Light Gray')                    return {name: 'Light Gray',         rarity: 5};
   }
   else if (H.breed == "HighlandPony")
   {
      if (coat == 'Chestnut')                      return {name: 'Chestnut',           rarity: 1};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 3};
      if (coat == 'Liver chestnut')                return {name: 'Liver Chestnut',     rarity: 4};
   }
   else if (H.breed == "Holsteiner")
   {
      if (coat == 'Light Grey')                    return {name: 'Light Grey',         rarity: 5};
   }
   else if (H.breed == "Icelandichorse")
   {
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Cherry bay')                    return {name: 'Cherry Bay',         rarity: 2};
      if (coat == 'Dapple Grey')                   return {name: 'Dapple Grey',        rarity: 2};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 2};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 2};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 4};
      if (coat == 'Light Grey')                    return {name: 'Light Grey',         rarity: 5};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 5};
   }
   else if (H.breed == "IrishHunter")
   {
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 1};
      if (coat == 'Fleabitten Grey')               return {name: 'Fleabitten Grey',    rarity: 1};
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 2};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 2};
      if (coat == 'Mouse Grey')                    return {name: 'Mouse Grey',         rarity: 2};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 2};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 3};
      if (coat == 'Liver chestnut')                return {name: 'Liver Chestnut',     rarity: 5};
   }
   else if (H.breed == "Knabstrupper")
   {
      if (coat == 'Bay Few Spots')                 return {name: 'Bay Few Spots',      rarity: 1};
      if (coat == 'Bay Snowflake')                 return {name: 'Bay Snowflake',      rarity: 1};
      if (coat == 'Chestnut')                      return {name: 'Chestnut',           rarity: 1};
      if (coat == 'Chestnut Few Spots')            return {name: 'Chstnt. Few Spots',  rarity: 1};
      if (coat == 'Chestnut Snowflake')            return {name: 'Chstnt. Snowflake',  rarity: 1};
      if (coat == 'Dapple Grey')                   return {name: 'Dapple Grey',        rarity: 1};
      if (coat == 'Bay')                           return {name: 'Bay',                rarity: 2};
      if (coat == 'Bay Spotted Blanket')           return {name: 'Bay Spot. Blanket',  rarity: 2};
      if (coat == 'Black')                         return {name: 'Black',              rarity: 2};
      if (coat == 'Black Snowflake')               return {name: 'Black Snowflake',    rarity: 2};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 2};
      if (coat == 'Bay Blanket')                   return {name: 'Bay Blanket',        rarity: 3};
      if (coat == 'Black Spotted Blanket')         return {name: 'Blk. Spot. Blank.',  rarity: 3};
      if (coat == 'Chestnut Blanket')              return {name: 'Chestnut Blanket',   rarity: 3};
      if (coat == 'Chestnut Spotted Blanket')      return {name: 'Cnut. Spot. Blnk.',  rarity: 3};
      if (coat == 'Few Spots')                     return {name: 'Few Spots',          rarity: 3};
      if (coat == 'Black Blanket')                 return {name: 'Black Blanket',      rarity: 4};
   }
   else if (H.breed == "KWPN")
   {
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 1};
      if (coat == 'Mouse Grey')                    return {name: 'Mouse Grey',         rarity: 2};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 2};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 3};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 4};
      if (coat == 'Cherry bay')                    return {name: 'Cherry Bay',         rarity: 5};
      if (coat == 'Flaxen Chestnut')               return {name: 'Flaxen Chestnut',    rarity: 5};
   }
   else if (H.breed == "Lipizzan")
   {
      if (coat == 'Fleabitten Gray')               return {name: 'Fleabitten Gray',    rarity: 1};
      if (coat == 'Liver chestnut')                return {name: 'Liver Chestnut',     rarity: 1};
      if (coat == 'Chestnut')                      return {name: 'Chestnut',           rarity: 2};
      if (coat == 'Black')                         return {name: 'Black',              rarity: 4};
      if (coat == 'Cherry bay')                    return {name: 'Cherry Bay',         rarity: 4};
   }
   else if (H.breed == "Lusitano")
   {
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 1};
      if (coat == 'Cherry bay')                    return {name: 'Cherry Bay',         rarity: 3};
      if (coat == 'Liver chestnut')                return {name: 'Liver Chestnut',     rarity: 3};
   }
   else if (H.breed == "Marwari")
   {
      if (coat == 'Black Overo')                   return {name: 'Black Overo',        rarity: 1};
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Cremello Tobiano')              return {name: 'Cremello Tobiano',   rarity: 1};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 1};
      if (coat == 'Mouse gray Tobiano')            return {name: 'Mouse G. Tobiano',   rarity: 1};
      if (coat == 'Black Tobiano')                 return {name: 'Black Tobiano',      rarity: 2};
      if (coat == 'Cherry bay Tobiano')            return {name: 'Chry. Bay Tob.',     rarity: 2};
      if (coat == 'Chestnut Overo')                return {name: 'Chestnut Overo',     rarity: 2};
      if (coat == 'Dun Overo')                     return {name: 'Dun Overo',          rarity: 2};
      if (coat == 'Liver chestnut Tobiano')        return {name: 'Lvr. Chstnt. Tob.',  rarity: 2};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 2};
      if (coat == 'Cherry Bay Overo')              return {name: 'Cherry Bay Overo',   rarity: 3};
      if (coat == 'Chestnut Tobiano')              return {name: 'Chestnut Tobiano',   rarity: 3};
      if (coat == 'Dun Tobiano')                   return {name: 'Dun Tobiano',        rarity: 3};
      if (coat == 'Light Gray')                    return {name: 'Light Gray',         rarity: 3};
      if (coat == 'Mouse Gray')                    return {name: 'Mouse Gray',         rarity: 3};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 4};
   }
   else if (H.breed == "Morgan")
   {
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Light Gray')                    return {name: 'Light Gray',         rarity: 2};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 3};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 3};
      if (coat == 'Mouse Gray')                    return {name: 'Mouse Gray',         rarity: 4};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 4};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 4};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 5};
   }
   else if (H.breed == "Mustang")
   {
      if (coat == 'Black Blanket')                 return {name: 'Black Blanket',      rarity: 1};
      if (coat == 'Black Spotted Blanket')         return {name: 'Blk. Spot. Blank.',  rarity: 1};
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Dun Blanket')                   return {name: 'Dun Blanket',        rarity: 1};
      if (coat == 'Dun Spotted Blanket')           return {name: 'Dun Spot. Blanket',  rarity: 1};
      if (coat == 'Few Spots')                     return {name: 'Few Spots',          rarity: 1};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 1};
      if (coat == 'Liver chestnut Blanket')        return {name: 'L. Chstnt. Blank.',  rarity: 1};
      if (coat == 'Liver chestnut Spotted Blanket')return {name: 'L C Spot. Blanket',  rarity: 1};
      if (coat == 'Cherry Spotted Blanket')        return {name: 'Chry. Spot. Blnk.',  rarity: 2};
      if (coat == 'Cherry bay Blanket')            return {name: 'Chry. Bay Blanket',  rarity: 2};
      if (coat == 'Chestnut Blanket')              return {name: 'Chestnut Blanket',   rarity: 2};
      if (coat == 'Chestnut Spotted Blanket')      return {name: 'C. Spot. Blanket',   rarity: 2};
      if (coat == 'Mouse Grey')                    return {name: 'Mouse Grey',         rarity: 3};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 3};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 3};
      if (coat == 'Dapple Grey')                   return {name: 'Dapple Grey',        rarity: 4};
      if (coat == 'Black')                         return {name: 'Black',              rarity: 5};
      if (coat == 'Cherry bay')                    return {name: 'Cherry Bay',         rarity: 5};
      if (coat == 'Flaxen Chestnut')               return {name: 'Flaxen Chestnut',    rarity: 5};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 5};
   }
   else if (H.breed == "NewfoundlandPony")
   {
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 1};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 1};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 3};
      if (coat == 'Flaxen Chestnut')               return {name: 'Flaxen Chestnut',    rarity: 3};
      if (coat == 'Mouse Gray')                    return {name: 'Mouse Gray',         rarity: 3};
   }
   else if (H.breed == "Nokota")
   {
      if (coat == 'Chestnut Overo')                return {name: 'Chestnut Overo',     rarity: 1};
      if (coat == 'Chestnut')                      return {name: 'Chestnut',           rarity: 4};
   }
   else if (H.breed == "PaintHorse")
   {
      if (coat == 'Black Tovero')                  return {name: 'Black Tovero',       rarity: 1};
      if (coat == 'Liver chestnut Tovero')         return {name: 'Lvr. Chstnt. Tov.',  rarity: 1};
      if (coat == 'Palomino Overo')                return {name: 'Palomino Overo',     rarity: 1};
      if (coat == 'Palomino Tobiano')              return {name: 'Palomino Tobiano',   rarity: 1};
      if (coat == 'Palomino Tovero')               return {name: 'Palomino Tovero',    rarity: 1};
      if (coat == 'Cherry Bay Overo')              return {name: 'Cherry Bay Overo',   rarity: 2};
      if (coat == 'Chestnut Tovero')               return {name: 'Chestnut Tovero',    rarity: 2};
      if (coat == 'Dapple grey Tobiano')           return {name: 'Dpl. Grey Tobiano',  rarity: 2};
      if (coat == 'Dun Overo')                     return {name: 'Dun Overo',          rarity: 2};
      if (coat == 'Liver chestnut Overo')          return {name: 'Lvr. Chstnt. Ov.',   rarity: 2};
      if (coat == 'Bay Tovero')                    return {name: 'Bay Tovero',         rarity: 3};
      if (coat == 'Black Overo')                   return {name: 'Black Overo',        rarity: 3};
      if (coat == 'Dark bay Overo')                return {name: 'Dark Bay Overo',     rarity: 3};
      if (coat == 'Dark bay Tovero')               return {name: 'Dark Bay Tovero',    rarity: 3};
      if (coat == 'Mouse grey Tobiano')            return {name: 'Mouse G. Tob.',      rarity: 3};
      if (coat == 'Black Tobiano')                 return {name: 'Black Tobiano',      rarity: 4};
      if (coat == 'Dun Tobiano')                   return {name: 'Dun Tobiano',        rarity: 4};
   }
   else if (H.breed == "PeruvianPaso")
   {
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 1};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 2};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 2};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 2};
      if (coat == 'Mouse Gray')                    return {name: 'Mouse Gray',         rarity: 3};
      if (coat == 'Flaxen Chestnut')               return {name: 'Flaxen Chestnut',    rarity: 4};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 5};
   }
   else if (H.breed == "PurebredSpanishHorse")
   {
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Flaxen Chestnut')               return {name: 'Flaxen Chestnut',    rarity: 1};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 1};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 1};
      if (coat == 'Chestnut')                      return {name: 'Chestnut',           rarity: 2};
      if (coat == 'Liver chestnut')                return {name: 'Liver Chestnut',     rarity: 2};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 3};
      if (coat == 'Mouse Grey')                    return {name: 'Mouse Grey',         rarity: 3};
      if (coat == 'Bay')                           return {name: 'Bay',                rarity: 5};
   }
   else if (H.breed == "QuarterHorse")
   {
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 1};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 3};
      if (coat == 'Light Grey')                    return {name: 'Light Grey',         rarity: 3};
      if (coat == 'Mouse Grey')                    return {name: 'Mouse Grey',         rarity: 3};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 4};
   }
   else if (H.breed == "QuarterPony")
   {
      if (coat == 'Black Overo')                   return {name: 'Black Overo',        rarity: 1};
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 1};
      if (coat == 'Fleabitten Gray')               return {name: 'Fleabitten Gray',    rarity: 1};
      if (coat == 'Palomino Overo')                return {name: 'Palomino Overo',     rarity: 1};
      if (coat == 'Palomino Tobiano')              return {name: 'Palomino Tobiano',   rarity: 1};
      if (coat == 'Bay Overo')                     return {name: 'Bay Overo',          rarity: 2};
      if (coat == 'Black Tobiano')                 return {name: 'Black Tobiano',      rarity: 2};
      if (coat == 'Dark bay Tobiano')              return {name: 'Dark Bay Tobiano',   rarity: 2};
      if (coat == 'Liver chestnut Tobiano')        return {name: 'Lvr. Chstnt. Tob.',  rarity: 2};
      if (coat == 'Mouse Gray')                    return {name: 'Mouse Gray',         rarity: 2};
      if (coat == 'Bay Tobiano')                   return {name: 'Bay Tobiano',        rarity: 3};
      if (coat == 'Chestnut Overo')                return {name: 'Chestnut Overo',     rarity: 3};
      if (coat == 'Chestnut Tobiano')              return {name: 'Chestnut Tobiano',   rarity: 3};
      if (coat == 'Flaxen Chestnut')               return {name: 'Flaxen Chestnut',    rarity: 3};
      if (coat == 'Light Gray')                    return {name: 'Light Gray',         rarity: 3};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 3};
      if (coat == 'Black')                         return {name: 'Black',              rarity: 4};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 4};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 4};
      if (coat == 'Cherry bay')                    return {name: 'Cherry Bay',         rarity: 5};
   }
   else if (H.breed == "RussianDonHorse")
   {
      if (coat == 'Light Gray')                    return {name: 'Light Gray',         rarity: 1};
      if (coat == 'Dapple Gray')                   return {name: 'Dapple Gray',        rarity: 2};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 2};
      if (coat == 'Black')                         return {name: 'Black',              rarity: 3};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 3};
   }
   else if (H.breed == "ShagyaArabian")
   {
      if (coat == 'Chestnut')                      return {name: 'Chestnut',           rarity: 1};
      if (coat == 'Black')                         return {name: 'Black',              rarity: 3};
      if (coat == 'Bay')                           return {name: 'Bay',                rarity: 5};
      if (coat == 'Mouse Grey')                    return {name: 'Mouse Grey',         rarity: 5};
   }
   else if (H.breed == "Shetland")
   {
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Mouse grey Tobiano')            return {name: 'Mouse G. Tob.',      rarity: 1};
      if (coat == 'Palomino Tobiano')              return {name: 'Palomino Tobiano',   rarity: 1};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 1};
      if (coat == 'Black Tobiano')                 return {name: 'Black Tobiano',      rarity: 2};
      if (coat == 'Dark bay Tobiano')              return {name: 'Dark Bay Tobiano',   rarity: 2};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 2};
      if (coat == 'Liver chestnut Tobiano')        return {name: 'Lvr. Chstnt. Tob.',  rarity: 2};
      if (coat == 'Mouse Grey')                    return {name: 'Mouse Grey',         rarity: 2};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 2};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 2};
      if (coat == 'Bay Tobiano')                   return {name: 'Bay Tobiano',        rarity: 3};
      if (coat == 'Chestnut Tobiano')              return {name: 'Chestnut Tobiano',   rarity: 3};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 4};
      if (coat == 'Light Grey')                    return {name: 'Light Grey',         rarity: 4};
   }
   else if (H.breed == "Standardbred")
   {
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 1};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 1};
      if (coat == 'Light Gray')                    return {name: 'Light Gray',         rarity: 2};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 2};
      if (coat == 'Dapple Gray')                   return {name: 'Dapple Gray',        rarity: 3};
      if (coat == 'Flaxen Chestnut')               return {name: 'Flaxen Chestnut',    rarity: 3};
   }
   else if (H.breed == "TennesseeWalker")
   {
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 1};
      if (coat == 'Dapple Grey')                   return {name: 'Dapple Grey',        rarity: 3};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 3};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 5};
   }
   else if (H.breed == "Thoroughbred")
   {
      if (coat == 'Mouse Grey')                    return {name: 'Mouse Grey',         rarity: 1};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 1};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 1};
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 2};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 2};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 3};
      if (coat == 'Flaxen Chestnut')               return {name: 'Flaxen Chestnut',    rarity: 4};
      if (coat == 'Light Grey')                    return {name: 'Light Grey',         rarity: 5};
   }
   else if (H.breed == "Trakehner")
   {
      if (coat == 'Cremello')                      return {name: 'Cremello',           rarity: 1};
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 1};
      if (coat == 'Mouse Gray')                    return {name: 'Mouse Gray',         rarity: 1};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 1};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 1};
      if (coat == 'Dun')                           return {name: 'Dun',                rarity: 2};
      if (coat == 'Light Gray')                    return {name: 'Light Gray',         rarity: 2};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 2};
      if (coat == 'Flaxen Chestnut')               return {name: 'Flaxen Chestnut',    rarity: 3};
   }
   else if (H.breed == "Welsh")
   {
      if (coat == 'Flaxen Liver chestnut')         return {name: 'Flaxen L. Chstnt.',  rarity: 1};
      if (coat == 'Roan')                          return {name: 'Roan',               rarity: 2};
      if (coat == 'Liver chestnut')                return {name: 'Liver Chestnut',     rarity: 4};
      if (coat == 'Palomino')                      return {name: 'Palomino',           rarity: 4};
      if (coat == 'Strawberry roan')               return {name: 'Strawberry Roan',    rarity: 4};
      if (coat == 'Flaxen Chestnut')               return {name: 'Flaxen Chestnut',    rarity: 5};
      if (coat == 'Mouse Grey')                    return {name: 'Mouse Grey',         rarity: 5};
   }
   return {name: null, rarity: null};
}

function calculateName()
{
   var rc = checkCoatRarity(), gender = H.gender;
   return H.passhorse ? 'Instant Pass Horse' : (rc.rarity ? (rc.rarity + '% ' + rc.name) : (gender + H.gp.toFixed(2)));
}



GM_log('Chimera (v' + VERSION + ') initialised ...');

INITIALIZED = true;