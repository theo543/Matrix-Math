let $container = document.createElement("div");
$container.classList.add("notification_container");
document.body.appendChild($container);

/**
 * @param $content {HTMLElement}
 * @param timeout_millis {number}
 */
export function pushNotification($content, timeout_millis) {
    const animation_length = 500;
    let $notification = document.createElement("div");
    $notification.classList.add("notification");
    $container.appendChild($notification);
    $notification.appendChild($content);
    $notification.style.backgroundColor = getComputedStyle($content).backgroundColor;
    $notification.animate({
        marginBottom: [(-$notification.getBoundingClientRect().height).toString() + 'px', getComputedStyle($notification).marginBottom]
    }, {
        duration: animation_length,
        easing: "ease-in-out",
    });
    setTimeout( () => {
        $notification.animate({
            opacity: [1, 0]
        }, animation_length).addEventListener("finish", () => $notification.remove());
    }, timeout_millis + animation_length);
}
