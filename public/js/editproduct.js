
        function imageEdit() {
            var checkBox = document.getElementById("myCheck");
            var text = document.getElementById("text");
            var img = document.getElementById("image1");
            console.log(checkBox);
            
            if (checkBox.checked == true){
                text.style.display = "block";
                img.style.display = "none";
            } else {
                text.style.display = "none";
                img.style.display = "block";
            }
        }
