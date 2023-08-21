import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sistema de Información Catastral Urbano';
  constructor () {
  }

  ngOnInit() {
    console.log(this.determineLocalIp());
  }

  determineLocalIp(): any[] {
    let ip = [];
    window.RTCPeerConnection = window.RTCPeerConnection;
   
    if (window.RTCPeerConnection)
    {
     
     var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
     pc.createDataChannel('');
     pc.createOffer(pc.setLocalDescription.bind(pc), noop);
   
     pc.onicecandidate = function(event)
     {
      if (event && event.candidate && event.candidate.candidate)
      {
       var s = event.candidate.candidate.split('\n');
       ip.push(s[0].split(' ')[4]);
      }
     }
    }   
    
    return ip;
  }

}
