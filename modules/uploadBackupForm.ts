import { backupFileInput, uploadBackupForm } from './domElements';
import itemManager from './ItemManager';
import { hideOptionsModal } from './optionsModal';

uploadBackupForm.onsubmit = async (event) => {
  event.preventDefault();
  // we should trigger a spinner here
  //const spinner = document.getElementById('spinner')
  //if (spinner) spinner.style.display = "block"

  // we'll get the file
  const file = backupFileInput.files && backupFileInput.files[0];
  if (file) {
    try {
      await itemManager.syncUpload(file);
      alert('Upload complete!');
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('There was a problem uploading your file, please try again');
    }
  } else {
    alert('Please select a file to upload');
  }

  // once the upload is done turn off spinner
  // if (spinner) spinner.style.display = "none"
  // close the options modal
  hideOptionsModal();
};
