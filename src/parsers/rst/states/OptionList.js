import SpecializedBody from './SpecializedBody';
import MarkupError from '../MarkupError';

/** Second and subsequent option_list option_list_items. */
class OptionList extends SpecializedBody {
    /** Option list item. */
    /* eslint-disable-next-line */
    option_marker(match, context, nextState) {
        let optionListItem;
        let blankFinish;
        try {
            [optionListItem, blankFinish] = this.option_list_item(match);
        } catch (error) {
            if (error instanceof MarkupError) {
                this.invalid_input();
            }
            throw error;
        }
        this.parent.add(optionListItem);
        this.blankFinish = blankFinish;
        return [[], nextState, []];
    }
}

OptionList.stateName = 'OptionList';
OptionList.constructor.stateName = 'OptionList';
export default OptionList;
