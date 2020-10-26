
// functions to serialize to intenger instead of date object
export  function serializeNewEvents(events) {
    return events.map(
        (ev) => {
            return {
                start: ev.start.getTime(),
                end: ev.end.getTime(),
                available: [] //initalize to empty
            }
        }
    )
}

export  function serializeSelectableEvents(events) {
    return events.map(
        (ev) => {
            return {
                start: ev.start.getTime(),
                end: ev.end.getTime(),
                available: ev.available,
                selected: ev.selected,
            }
        }
    )
}

export function deserializeEvents(events) {
    return events.map(
        (ev) => {
            return {
                start: new Date(ev.start),
                end: new Date(ev.end),
                available: ev.available
            }
        }
    )
}