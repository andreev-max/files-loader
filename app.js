import firebase from 'firebase';
import 'firebase/storage'
import { upload } from './upload.js';

const firebaseConfig = {
	apiKey: 'AIzaSyAcyDb_N5UjqXyVTeAunFPNFA8IuPuSkGo',
	authDomain: 'files-loader.firebaseapp.com',
	projectId: 'files-loader',
	storageBucket: 'files-loader.appspot.com',
	messagingSenderId: '714884629074',
	appId: '1:714884629074:web:dbd66f477f36c97bde558b'
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();


upload('#file', {
	multi: true,
	accept: [ '.png', '.jpg', 'jpeg', 'gif' ],
	onUpload(files, blocks) {
		files.forEach((file, index) => {
      const ref = storage.ref(`images/${file.name}`)
      const task = ref.put(file)

      task.on('state_changed', snapshot => {
        const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
        const block = blocks[index].querySelector('.preview-info-progress')
        block.textContent = `${percentage}%`
        block.style.width = `${percentage}%`
        // console.log(percentage)
      }, error => {
        console.log(error)
      }, () => {
        task.snapshot.ref.getDownloadURL().then((url) => {
          console.log('Download URL', url)
        })
      })
    })
	}
});
