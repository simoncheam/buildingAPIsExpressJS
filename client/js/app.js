

const $body = $(document.body);
const chirpDiv2 = $('#chirpDiv2');

// Buttons:
const makeChirpBtn = $('#chirpButton');

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})


//Gets current list of all chirps from server
function getChirp(username, chirpMessage, createdAt) {

    // clears old data to prevent stacking!
    $(chirpDiv2).empty();

    $.ajax({
        type: "GET",
        url: "/api/chirps/"
    }).then((getChirps) => {

        for (const id in getChirps) {

            if (id === 'nextid') {
                return;
            }

            $(chirpDiv2).prepend(`
            <div class="offset-md-3 col-md-6">
                <div class="card shadow-lg m-2">
                    <div class="card-body">
                        <h6 class="card-header bg-light">@${getChirps[id].user}</h6>
                            <p class="card-text m-4"> ${getChirps[id].text} </p>
                            <p class="card-text mt-4"> ${getChirps[id].createdAt} </p>
                            <button onClick="delChirp(${id}) " class='btn btn-danger' >Delete Chirp!</button>

                            <button onClick="editChirp(${id},'${getChirps[id].user}','${getChirps[id].text}' ) " class='btn btn-warning' >Edit Chirp!</button>
                    </div>
                </div>
            </div>`
            );
        }
    })
}
getChirp();


// DELETE CHIRP FUNCTION
function delChirp(id) {

    // SWAL - delete confirm
    Swal.fire({
        title: 'Are you sure?',
        text: "Your precious chirp will be gone forever!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {


            $.ajax({
                type: "DELETE",
                url: `/api/chirps/${id}`
            }).then(response => {
                console.log(response);
                getChirp();
            });

            Swal.fire(
                'Deleted!',
                'Your chirp has been deleted.',
                'success'
            )
        }
    })

}


//ref https://sweetalert2.github.io/#multiple-inputs

async function editChirp(id, user, text) {

    const formResponse = await Swal.fire({
        title: 'Second thoughts?🧐 \n\n Enter updates below👇',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="new username">' +
            '<input id="swal-input2" class="swal2-input" placeholder="new chirp">',
        focusConfirm: false,

        preConfirm: () => {

            return [

                user = document.getElementById('swal-input1').value,
                text = document.getElementById('swal-input2').value,
                console.log('SWAL UPDATED CHIRP VALS!'),

            ]
        }


    });

    //Input val - update chirp fields blank
    if (user === "" || text === "") {

        //add swal missing item alert
        Swal.fire({
            title: `Forget Something?\n\n You need to add something for us to update 🙄 `,
            imageUrl: 'https://media0.giphy.com/media/SWoRKslHVtqEasqYCJ/giphy.gif',
            width: 600,
            padding: '3em',

        })

        return;
    }



    //Updating chirp if form completed
    if (formResponse) {
        $.ajax({

            type: "PUT",
            url: `/api/chirps/${id}`, // variable
            data: {
                "user": `${user}`, ///from form in modal
                "text": `${text}`
            }
        }).then(response => {
            console.log(response);

            console.log('SERVER UPDATED!');

            Toast.fire({
                icon: 'success',
                title: 'Chirp successful! 🕊'
            })

            getChirp();
        })
    }

};



makeChirpBtn.click(async function (e) {
    e.preventDefault();

    ///grab input values
    const username = $('#chirpUsername').val();
    const chirpMessage = $('#chirpMessage').val();
    let createdAt = Date.now();

    // Input validation - new chirp 
    if (!username || !chirpMessage) {
        console.log('fill in the blanks!');

        Toast.fire({
            icon: 'error',
            title: '❌ Fill in the blanks or Chirpy will be mad! 🐦👿'
        })
        return;
    }


    //SWAL - Post confirmation if truthy values
    if (username && chirpMessage) {

        const { value: accept } = await Swal.fire({
            title: 'Do you really want to share this with everyone?🤔',
            input: 'checkbox',
            inputValue: 1,
            inputPlaceholder:
                'Yes, I do',
            confirmButtonText:
                'Continue <i class="fa fa-arrow-right"></i>',
            inputValidator: (result) => {
                return !result && 'Ok, we won\'t post it'
            }

        })

        if (accept) {
            Swal.fire('Congrats :)')


            makeChirp(username, chirpMessage, createdAt)
        }

    }
    //clear input values
    $('#chirpUsername').val("")
    $('#chirpMessage').val("");

});


/// DEFINE FUNCTION: makeChirp 
function makeChirp(username, chirpMessage) {

    $.ajax({
        type: "POST",
        data: {
            "user": username,
            "text": chirpMessage
        },
        url: "/api/chirps/new"
    }).then((response) => {
        console.log(response);
        getChirp();


    });
    Toast.fire({
        icon: 'success',
        title: '✅ Chirp successful! 🐦'
    })
}



