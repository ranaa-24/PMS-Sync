function Loader() {
    return (
        <div className="flex flex-row gap-2">
            <div className="size-2 rounded-full bg-main-font animate-bounce"></div>
            <div className="size-2 rounded-full bg-main-font animate-bounce [animation-delay:-.3s]"></div>
            <div className="size-2 rounded-full bg-main-font animate-bounce [animation-delay:-.5s]"></div>
        </div>
    )
}

export default Loader