import SpecializedBody from './SpecializedBody';

/** Second and subsequent enumerated_list list_items. */
class EnumeratedList extends SpecializedBody {
    /** Enumerated list item. */
    enumerator(match, context, nextState) {
        /* eslint-disable-next-line no-unused-vars */
        const [format, sequence, text, ordinal] = this.parse_enumerator(
            match, this.parent.attributes.enumtype,
);
        if ((format !== this.format
              || (sequence !== '#' && (sequence !== this.parent.attributes.enumtype
                                       || this.auto// fixme
                                       || ordinal !== (this.lastordinal + 1)))
              || !this.is_enumerated_list_item(ordinal, sequence, format))) {
            // # different enumeration: new list
            this.invalid_input();
        }
        if (sequence === '#') {
            this.auto = 1;
        }
        const [listitem, blankFinish] = this.list_item(
            match.result.index + match.result[0].length,
);
        this.parent.add(listitem);
        this.blankFinish = blankFinish;
        this.lastordinal = ordinal;
        return [[], nextState, []];
    }
}
EnumeratedList.stateName = 'EnumeratedList';
EnumeratedList.constructor.stateName = 'EnumeratedList';
export default EnumeratedList;
