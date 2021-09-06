class YoutubeVideoController {
    constructor(options) {
        this.videoObject;
        this.video = options.video;
        this.videoId = options.videoId;
        this.titleVideo = options.titleVideo;
        this.classFullScreen = options.classFullScreen || 'streaming-full-screen';
        this.isFullScreen = options.isFullScreen || false;
        this.videoContainer = options.videoContainer;
        this.destroyEnded = options.destroyEnded || false;
        this.initMute = options.initMute || false;
        this.callBackFullScreen = options.callBackFullScreen || null;
        this.callBackMinimize = options.callBackMinimize || null;
        this.initControls = options.initControls || 1;
        this.isDestroy = false;

        this.init(this);
    }

    init(that) {
        if (window.YT) {
            that.youTubePlayer(that);
        } else {
            let tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            let firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = () => {
                that.youTubePlayer(that);
            };
        }
    }

    youTubePlayer(that) {
        that.videoObject = new YT.Player(that.video, {
            videoId: that.videoId,
            playerVars: {
                'controls': that.initControls,
                'disablekb': 1,
                'fs': 0,
                'rel': 0,
                'modestbranding': 1,
                'iv_load_policy': 1,
            },
            events: {
                'onReady': function onPlayerReady(event) {
                    that.videoContainer.style.display = 'flex';
                    event.target.playVideo();

                    if (that.titleVideo) {
                        that.titleVideo.innerHTML = event.target.playerInfo.videoData.title;
                    }

                    if (that.initMute) {
                        that.muted(true);
                    }
                },
                'onStateChange': function onStateChange(event) {
                    if (that.minimizeStorage('get') != 'true') {
                        if (that.isFullScreen && event.data == YT.PlayerState.PLAYING) {
                            that.fullScreen();
                        }
                    }
                    if (that.destroyEnded) {
                        if (event.data == 0) {
                            that.destroy();
                        }
                    }
                }
            }
        });
    }

    fullScreen() {
        this.videoContainer.classList.add(this.classFullScreen);
        this.isFullScreen = false;
        this.muted(false);
        this.play();
        this.callBackFullScreen();
    }

    minimize() {
        this.videoContainer.classList.remove(this.classFullScreen);
        this.muted(true);
        this.callBackMinimize();
    }

    destroy() {
        this.isDestroy = true;
        this.videoContainer.style.display = 'none';
        this.videoObject.destroy();
    }

    play() {
        this.videoObject.playVideo();
    }

    pause() {
        this.videoObject.pauseVideo();
    }

    stop() {
        this.videoObject.stopVideo();
    }

    muted(isMute) {
        if (isMute) {
            this.videoObject.mute();
        } else {
            this.videoObject.unMute();
        }
    }
}

export default YoutubeVideoController;
