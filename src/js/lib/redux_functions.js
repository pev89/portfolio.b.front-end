import moment from 'moment'
//REMOVE
export function removeFromListWithId( _old_items_list, id ) {
  return _old_items_list.filter( function ( obj ) {
    return obj.id != id
  })
}
//REMOVE FROM A LIST
export function removeFromList( _old_items_list, _new_item ) {
  for ( var i = 0; i < _old_items_list.length; i++ ) {
    if ( _old_items_list[i].id == _new_item.id ) {
      _old_items_list.splice( i, 1 )
    }
  }
  return _old_items_list
}
//ADD AN ITEM FROM A LIST (Merging)
export function putInList( _old_items_list, _new_item ) {
  // put the _new_item in the _old_items_list
  let updated = false
  for ( var i = 0; i < _old_items_list.length; i++ ) {
    if ( _old_items_list[i].id == _new_item.id ) {
      _old_items_list[i] = _new_item
      updated = true
    }
  }
  if ( !updated ) {
    _old_items_list.push( _new_item )
  }
  return _old_items_list;
}
//MERGE TWO LISTS OF ITEMS
export function putListInList( _old_items_list, _new_items_list ) {
  //we loop through the new list and for each item we add it to the old list
  for ( var i = 0; i < _new_items_list.length; i++ ) {
    _old_items_list = putInList(_old_items_list, _new_items_list[i])
  }
  //then we return it
  return _old_items_list
}
//CREATE DICTIONARY WITH THE DATE INDEXES
export function createDateIndex( _items ) {
  //loop through the items and create a date index
  let result = {}
  for ( var i = 0; i < _items.length; i++ ) {
    let item_date = moment( _items[i].start_time ).startOf( 'day' )
    if (!( item_date in result )) {
      result[item_date] = [ ];
    }
    result[item_date].push( i )
  }
  return result
}
export function createIndex( _items ) {
  // loop throught the result and create an index for fast look up
  let result = {}
  for ( var i = 0; i < _items.length; i++ ) {
    result[_items[i].id] = i
  }
  return result
}
