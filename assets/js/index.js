const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const heading = $('header h2')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')
const currentTime = $('.progress-wrap .currentTime')
const duration = $('.progress-wrap .duration')
const progress = $('#progress')
const sound = $('#sound')
const volumeBtn = $$('.sound-section .sound-icon')
const playlist = $('.playlist')
const songTitles = heading.querySelectorAll('.song-title-sub')

const defaultImageUrl = './assets/img/'
const defaultPathUrl = './assets/source/'
const PLAYER_KEY = 'Kiennt-player'

// loading page
const loading = document.querySelector('.loading')
const logos = document.querySelectorAll('#logo path')

Array.from(logos).forEach(logo => {
	logo.style.strokeDasharray = `${logo.getTotalLength()}px`
	logo.style.strokeDashoffset = `${logo.getTotalLength()}px`
})

// end loading page

const app = {
	currentIndex: 0,
	isPlaying: false,
	isRandom: false,
	isRepeat: false,
	newTime: 0,
	timeEnd: 0,
	newOffsetProgress: 0,
	currentVolume: 1,
	isMute: false,
	isOnMouseAndTouchOnProgress: false,
	config: JSON.parse(localStorage.getItem(PLAYER_KEY)) || {},
	setConfig: function(key, value) {
		this.config[key] = value
		localStorage.setItem(
			PLAYER_KEY,
			JSON.stringify(this.config)
		)
	},

	songs: [
		{
			name: 'Trốn Tìm',
			singer: 'Đen',
			path: `${defaultPathUrl}tron-tim.mp3`,
			image: `${defaultImageUrl}tron-tim.jpg`
		},
		{
			name: 'Chỉ Là Không Cùng Nhau (Live Version)',
			singer: 'Tăng Phúc x Trương Thảo Nhi',
			path: `${defaultPathUrl}chi-la-khong-cung-nhau(live-version).mp3`,
			image: `${defaultImageUrl}chi-la-khong-cung-nhau(live-version).jpg`,
		},
		{
			name: 'Hạ Còn Vương Nắng',
			singer: 'DatKaa x Kido',
			path: `${defaultPathUrl}ha-con-vuong-nang.mp3`,
			image: `${defaultImageUrl}ha-con-vuong-nang.jpg`,
		},
		{
			name: 'Tự Em Đa Tình (Phong DN Remix)',
			singer: 'Quinn',
			path: `${defaultPathUrl}tu-em-da-tinh(phong-dn-remix).mp3`,
			image: `${defaultImageUrl}tu-em-da-tinh(phong-dn-remix).jpg`,
		},
		{
			name: 'Tương Phùng',
			singer: 'Long Nón Lá x The 199X',
			path: `${defaultPathUrl}tuong-phung.mp3`,
			image: `${defaultImageUrl}tuong-phung.jpg`,
		},
		{
			name: 'Tự Em Đa Tình',
			singer: 'Quinn',
			path: `${defaultPathUrl}tu-em-da-tinh.mp3`,
			image: `${defaultImageUrl}tu-em-da-tinh.jpg`,
		},
		{
			name: 'Lạc Lõng (Cô Độc Vương 3)',
			singer: 'Thiên Tú',
			path: `${defaultPathUrl}lac-long(co-doc-vuong-3).mp3`,
			image: `${defaultImageUrl}lac-long(co-doc-vuong-3).jpg`,
		},
		{
			name: 'Đừng Như Người Dưng',
			singer: 'Nhật Phong',
			path: `${defaultPathUrl}dung-nhu-nguoi-dung.mp3`,
			image: `${defaultImageUrl}dung-nhu-nguoi-dung.jpg`,
		},
		{
			name: 'Cô Độc Vương 2',
			singer: 'Thiên Tú',
			path: `${defaultPathUrl}co-doc-vuong-2.mp3`,
			image: `${defaultImageUrl}co-doc-vuong-2.jpg`,
		},
		{
			name: 'Cafe Không Đường',
			singer: 'G5RSquad',
			path: `${defaultPathUrl}cafe-khong-duong.mp3`,
			image: `${defaultImageUrl}cafe-khong-duong.jpg`,
		},
		{
			name: 'Thương Thầm (Lofi Version)',
			singer: 'NB3 Hoài Bảo x Freak D',
			path: `${defaultPathUrl}thuong-tham(loli-version).mp3`,
			image: `${defaultImageUrl}thuong-tham(loli-version).jpg`,
		},
		{
			name: 'Vách Ngọc Ngà (New Version)',
			singer: 'G5RSquad x Phan Ann',
			path: `${defaultPathUrl}vach-ngoc-nga-new-version.mp3`,
			image: `${defaultImageUrl}vach-ngoc-nga-new-version.jpg`,
		},
		{
			name: 'Quan Tài Hư',
			singer: 'Young Milo',
			path: 'https://aredir.nixcdn.com/NhacCuaTui1014/QuanTaiHu-YoungMilo-6996488.mp3?st=QrUxW5V5E0CSsxXZfCwgKQ&e=1623247310',
			image: ''
		}
	],

	loadCurrentSong: function() {
		const _this = this
		const songList = $$('.song')
		const activeSong = $('.song.active')

		// Load thông tin bài hát hiện tại
		const textHeading = `${this.currentSong.name} - ${this.currentSong.singer}`
		Array.from(songTitles).forEach(songTitle => {
			return songTitle.innerText = textHeading
		})

		this.scrollHeading()
		
		cdThumb.style.backgroundImage =
			this.currentSong.image !== '' ? 
			`url('${this.currentSong.image}')` :
			`url('${defaultImageUrl}logo.png')`

		audio.src = this.currentSong.path

		this.scroolToActiveSong()

		// Lưu vị trí song hiện tại vào localStorage
		this.setConfig('currentIndex', this.currentIndex)
		
		// Xử lý song active không cần render lại
		if(activeSong && songList.length > 0) {
			activeSong.classList.remove('active')

			songList.forEach(song => {
				if(Number(song.dataset.index) === _this.currentIndex)
					song.classList.add('active')
			})
		}
	},

	loadConfig: function() {
		if(Object.entries(this.config).length) {
			this.currentIndex = this.config.currentIndex ? this.config.currentIndex : 0
			this.isRandom = this.config.isRandom ? this.config.isRandom : false
			this.isRepeat = this.config.isRepeat ? this.config.isRepeat : false
			this.newTime = this.config.newTime ? this.config.newTime : 0
			this.timeEnd = this.config.timeEnd ? this.config.timeEnd : 0
			this.currentVolume = this.config.currentVolume ? this.config.currentVolume : 1
		}
	},

	defineProperty: function() {
		Object.defineProperty(this, 'currentSong', {
			get: function () {
				return this.songs[this.currentIndex]
			},
		})
	},

	render: function() {
		const _this = this

		// Render danh sánh bài hát ra view
		const htmls = this.songs.map(function (song, index) {

			return `
				<div data-index="${index}" class="song ${index === _this.currentIndex ? 'active' : ''}">
		            <div
		                class="thumb"
		                style="background-image: url('${song.image ? song.image : defaultImageUrl + 'logo.png'}');"
		            ></div>
		            <div class="body">
		                <h3 class="title">${song.name}</h3>
		                <p class="author">${song.singer}</p>
		            </div>
		            <div class="options">
		                <i class="fas fa-ellipsis-h"></i>
		                <div class="song-waves">
							<span class="song-wave__col" style="--song-wave-index: 1"></span>
							<span class="song-wave__col" style="--song-wave-index: 2"></span>
							<span class="song-wave__col" style="--song-wave-index: 3"></span>
							<span class="song-wave__col" style="--song-wave-index: 4"></span>
							<span class="song-wave__col" style="--song-wave-index: 5"></span>
						</div>
		            </div>
		        </div>
			`
		})

		playlist.innerHTML = htmls.join('')
	},

	handleEvents: function() {
		const _this = this
		const cdWidth = cd.offsetWidth

		// Xử lý height dashbroad
		$('.playlist').style.marginTop = ($('.dashboard').offsetHeight + 30) + 'px'

		// Xử lý CD quay / dừng
		const CDRotate = cdThumb.animate([
			{
				transform: 'rotate(360deg)',
			}
		],
		{
			duration: 10000,
			iterations: Infinity,
		})

		CDRotate.pause()

		// Thu nhỏ / phóng to thumb khi scroll
		document.onscroll = function() {
			const scrollTop = window.scrollY ||
				document.documentElement.scrollTop
			const newCDWidth = cdWidth - scrollTop

			cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0
			cd.style.opacity = newCDWidth / cdWidth
		}

		// play song on click
		playBtn.onclick = function() {
			const songWaveCols = $$('.song.active .song-wave__col')

			_this.isPlaying = !_this.isPlaying
			player.classList.toggle('playing', _this.isPlaying)

			if(_this.isPlaying) {
				audio.play()
				CDRotate.play()
			}
			else {
				audio.pause()
				CDRotate.pause()
			}

			_this.playSongWave(songWaveCols)
		}

		// Xử lý sự kiện khi nhấn nút cách (space)
		document.onkeypress = function(e) {
			const songWaveCols = $$('.song.active .song-wave__col')
			e.preventDefault()
			if(e.keyCode === 32) {
				if(_this.isPlaying === false) {
					audio.play()
					_this.isPlaying = true
					CDRotate.play()
				}else {
					audio.pause()
					_this.isPlaying = false
					CDRotate.pause()
				}
				_this.playSongWave(songWaveCols)
			}
		}

		// Xử lý sự kiện khi audio play
		audio.onplay = function() {
			_this.isPlaying = true
			player.classList.toggle('playing', _this.isPlaying)
		}

		audio.onloadedmetadata = function () {
			_this.timeEnd = audio.duration
			_this.setConfig('timeEnd', _this.timeEnd)

			const timeList = _this.convertSecToMin(_this.timeEnd)
			const min = Number(timeList[0]) >= 10 ? 
				Number(timeList[0]) : `0${Number(timeList[0])}`
			const sec = Number(timeList[1]) >= 10 ? 
				Number(timeList[1]) : `0${Number(timeList[1])}`

			duration.innerText = `${min}:${sec}`
		}

		// Xử lý sự kiện khi audio pause
		audio.onpause = function() {
			_this.isPlaying = false
			player.classList.toggle('playing', _this.isPlaying)
		}

		// xử lý sự kiện khi audio ended
		audio.onended = function() {
			_this.isRepeat ? audio.play() : nextBtn.click()
		}

		// Xử lý sự kiện khi update audio time current
		audio.ontimeupdate = function() {
			_this.newTime = audio.currentTime / _this.timeEnd * 100
			_this.newTime = _this.newTime ? _this.newTime : 0
			progress.value = _this.newTime
			_this.setConfig('newTime', _this.newTime)

			const timeList = _this.convertSecToMin(audio.currentTime)
			const min = timeList[0] >= 10 ? 
				timeList[0] : `0${timeList[0]}`
			const sec = timeList[1] >= 10 ? 
				timeList[1] : `0${timeList[1]}`

			currentTime.innerText = `${min}:${sec}`
		}

		// Xử lý âm thanh audio
		sound.onchange = function(e) {
			audio.muted = false
			audio.volume = this.value / 100
			_this.currentVolume = audio.volume
			if(Number.parseFloat(_this.currentVolume) === 1) {
				volumeBtn[0].classList.remove('active')
				volumeBtn[1].classList.add('active')
			}else if(Number.parseFloat(_this.currentVolume) === 0) {
				volumeBtn[0].classList.add('active')
				volumeBtn[1].classList.remove('active')
			}else {
				volumeBtn[0].classList.remove('active')
				volumeBtn[1].classList.remove('active')
			}
			_this.setConfig('currentVolume', _this.currentVolume)
		}

		volumeBtn[0].onclick = function() {
			_this.isMute = !_this.isMute
			if(_this.isMute) {
				audio.muted = _this.isMute
				sound.value = 0
				audio.volume = 0
			}else {
				audio.muted = false
				sound.value = _this.currentVolume * 100
				audio.volume = _this.currentVolume
			}
			if(_this.currentVolume === 0) 
				volumeBtn[0].classList.add('active')
			else
				volumeBtn[0].classList.toggle('active', _this.isMute)
			volumeBtn[1].classList.remove('active')
		}

		volumeBtn[1].onclick = function() {
			_this.isMute = false
			audio.muted = _this.isMute
			
			if(audio.volume === 0 || Number(sound.value) < 100) {
				sound.value = 100
				audio.volume = 1
				volumeBtn[1].classList.add('active')
			}else if(Number(sound.value) === 100) {
				audio.volume = _this.currentVolume
				sound.value = _this.currentVolume * 100
				volumeBtn[1].classList.toggle('active', (Number(_this.currentVolume) === 1))
			}
			volumeBtn[0].classList.remove('active')
		}

		// Xử lý khi tua nhạc
        progress.oninput = function(e) {
        	console.log(e.target.value)
            _this.isOnMouseAndTouchOnProgress = false
            if(!_this.isOnMouseAndTouchOnProgress) {
	            if (audio.duration) {
	                const seekTime = audio.duration / 100 * e.target.value
	                audio.currentTime = seekTime
	            }
            }
        }

        progress.onmousestart = function(e) {
			_this.isOnMouseAndTouchOnProgress = true
		}
		progress.onmouseup = function(e) {
			_this.isOnMouseAndTouchOnProgress = true
		}

		progress.ontouchstart = function(e) {
			_this.isOnMouseAndTouchOnProgress = true
		}
		progress.ontouchup = function(e) {
			_this.isOnMouseAndTouchOnProgress = true
		}

		// Next song on click
		nextBtn.onclick = function() {
			if(_this.isRandom) {
				_this.playRandomSong()
			}else {
				_this.nextSong()
			}

			const songWaveCols = $$('.song.active .song-wave__col')
			_this.timeEnd = 0
			audio.play()
			_this.isPlaying = true
			_this.playSongWave(songWaveCols)
		}

		// Prev song on click
		prevBtn.onclick = function() {
			if(_this.isRandom) {
				_this.playRandomSong()
			}else {
				_this.prevSong()
			}

			const songWaveCols = $$('.song.active .song-wave__col')
			_this.timeEnd = 0
			audio.play()
			_this.playSongWave(songWaveCols)
		}

		// Repeat song on click
		repeatBtn.onclick = function() {
			_this.isRepeat = !_this.isRepeat
			this.classList.toggle('active', _this.isRepeat)
			_this.setConfig('isRepeat', _this.isRepeat)
		}

		// Random song on click
		randomBtn.onclick = function() {
			_this.isRandom = !_this.isRandom
			this.classList.toggle('active', _this.isRandom)
			_this.setConfig('isRandom', _this.isRandom)
		}

		// Sử lý sự kiện thay đổi active song in play list
		playlist.onclick = function(e) {
			const songActiveNode = e.target.closest('.song.active')
			const songNode = e.target.closest('.song:not(.active)')
			const optionSong = e.target.closest('.option')

			if(songActiveNode !== null) {
				_this.isPlaying = true
				audio.play()
			}

			if(songNode || optionSong) {
				if(songNode) {
					_this.isPlaying = true
					_this.currentIndex = Number(songNode.dataset.index)
					_this.loadCurrentSong()
					audio.play()
					CDRotate.play()
					const songWaveCols = $$('.song.active .song-wave__col')
					_this.playSongWave(songWaveCols)
				}
			}

			if(optionSong) {
				console.log("You clicked option!")
			}
		}
	},

	nextSong: function() {
		this.currentIndex++;
	    if (this.currentIndex > this.songs.length - 1) {
	      this.currentIndex = 0
	    }
	    this.loadCurrentSong()
	},

	prevSong: function() {
		this.currentIndex--;
		if (this.currentIndex < 0)
			this.currentIndex = this.songs.length - 1
		this.loadCurrentSong()
	},

	playRandomSong: function() {
		let newIndex

		do {
			newIndex = Math.floor(Math.random() * this.songs.length)
		} while (newIndex === this.currentIndex)
		this.currentIndex = newIndex
		this.loadCurrentSong()
	},

	scroolToActiveSong: function() {
		setTimeout(() => {
			if(this.currentIndex <= 3) {
				$('.song.active').scrollIntoView({
					behavior: 'smooth',
					block: 'end',
				})
			}else {
				$('.song.active').scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				})
			}
		}, 300)
	},

	convertSecToMin: function(sec) {
		const mins = Math.floor((sec % 3600) / 60)
		const secs = Math.floor(sec % 60)

		return [mins, secs]
	},

	scrollHeading: function() {
		heading.style.transform = ""
		heading.style.transition = ""

		if(songTitles[0].offsetWidth > heading.offsetWidth) {
			songTitles[1].style.display = "inline"
  			songTitles[0].style.marginRight = '30px'
			heading.style.transform = `translateX(-${songTitles[0].offsetWidth + 30}px)`
			heading.style.transition = `transform 5.3s linear 1s`
			heading.style.justifyContent = "flex-start"
		}
		else {
			songTitles[1].style.display = "none"
  			songTitles[0].style.marginRight = '0'
			heading.style.justifyContent = "center"
			heading.style.transform = ""
			heading.style.transition = ""
		}

	},

	playSongWave: function(songWaveCols) {
		Array.from(songWaveCols).forEach((col, index) => {
			col.style.animation = this.isPlaying ?
			`growUpAni .5s ease infinite ${index * .2}s` :
			`growUpAni .5s ease infinite ${index * .2}s, backToStartPointAni 1s ease forwards`
		})
	},

	start: function() {
		this.defineProperty()
		this.loadConfig()
		this.handleEvents()
		this.loadCurrentSong()
		this.render()
		randomBtn.classList.toggle('active', this.isRandom)
		repeatBtn.classList.toggle('active', this.isRepeat)
		sound.value = (this.currentVolume * 100)
		audio.volume = this.currentVolume
		audio.currentTime = this.timeEnd / 100 * this.newTime

		if(this.currentVolume === 1) {
			volumeBtn[0].classList.remove('active')
			volumeBtn[1].classList.add('active')
		}else if(this.currentVolume === 0) {
			volumeBtn[0].classList.add('active')
			volumeBtn[1].classList.remove('active')
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	setTimeout(() => {
		loading.classList.add('hidden')
		app.start()
		setTimeout(() => {
			loading.remove()

			setInterval(() => {
				app.scrollHeading()
			}, 10000)
		}, 2000)
	}, 3000)
})