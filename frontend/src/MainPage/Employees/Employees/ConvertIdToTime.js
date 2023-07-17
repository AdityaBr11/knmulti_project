import React from 'react'

const ConvertIdToTime = (objectId) => {
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
}

export default ConvertIdToTime