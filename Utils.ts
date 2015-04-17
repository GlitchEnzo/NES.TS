module NES.TS
{ 
    class Utils
    {
        static copyArrayElements(src, srcPos, dest, destPos, length) 
        {
            for (var i = 0; i < length; ++i)
            {
                dest[destPos + i] = src[srcPos + i];
            }
        }
    
        static copyArray(src)
        {
            var dest = new Array(src.length);
            for (var i = 0; i < src.length; i++)
            {
                dest[i] = src[i];
            }
            return dest;
        }
    
        static fromJSON(obj, state)
        {
            for (var i = 0; i < obj.JSON_PROPERTIES.length; i++)
            {
                obj[obj.JSON_PROPERTIES[i]] = state[obj.JSON_PROPERTIES[i]];
            }
        }
    
        static toJSON(obj)
        {
            var state = {};
            for (var i = 0; i < obj.JSON_PROPERTIES.length; i++)
            {
                state[obj.JSON_PROPERTIES[i]] = obj[obj.JSON_PROPERTIES[i]];
            }
            return state;
        }
    }
}


