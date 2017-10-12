/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function() {
    // http://stackoverflow.com/questions/935127/how-to-access-parent-iframe-from-javascript
    // https://stackoverflow.com/questions/3588315/how-to-check-if-the-user-can-go-back-in-browser-history-or-not/16580022
    // https://stackoverflow.com/a/7651297/6086756
    alert("sangar");

    // Hijack Back Button
    var iframe = document.body.getElementsByTagName('iframe')[0];
    function onBackKeyDown(e) {
      alert(iframe.contentWindow.document);
      e.preventDefault();
      if (iframe.contentWindow.document.referrer === "") {
        navigator.app.exitApp();
      }
      else {
        iframe.contentWindow.history.back();
      }
    }
    document.addEventListener("backbutton", onBackKeyDown, false);

    // Show when device ready
    iframe.style.display = "block";

    function sendCallbackToIframe(action, args) {
      return iframe.contentWindow.postMessage({
        from: "cordova",
        args: args,
        action: action,
      }, "*");
    }

    this.getCurrentPosition = function (success, error, options) {
      navigator.geolocation.getCurrentPosition(function (position) {
          var webObject = {
            coords: {
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              speed: position.coords.speed,
            },
            timestamp: position.timestamp,
          }
          return sendCallbackToIframe(success, [webObject]);
        }, function (err) {
          var webObject = {
            code: err.code,
            message: err.message,
          }
          return sendCallbackToIframe(error, [webObject]);
        }, options || null);
    }

    var me = this;
    // Add Event Listener...
    window.addEventListener("message", function(e) {
      const action = e.data;
      var funcName = e.data.funcName;
      var args = e.data.args;
      if (funcName) {
        me[funcName].apply(me, args || []);
      }
    }, false);
  },

};

app.initialize();
