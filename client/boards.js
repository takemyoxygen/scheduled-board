const Boards = {
    load: () => fetch('/api/boards', {credentials: "same-origin"})
        .then(_ => _.json())
}

export default Boards