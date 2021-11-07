import {useState, FormEvent, ChangeEvent} from 'react';
import {ThunkAppDispatch} from '../../types/action';
import {connect, ConnectedProps} from 'react-redux';
import {ReviewData} from '../../types/review-data';
import {reviewAction} from '../../store/api-actions';
import {useParams} from 'react-router-dom';

const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type FilmParam = {
  id: string;
}

const mapDispatchToProps = (dispatch: ThunkAppDispatch) => ({
  onSubmit(reviewData: ReviewData, errorHandler: (error: string) => void) {
    dispatch(reviewAction(reviewData, errorHandler));
  },
});

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function ReviewForm({onSubmit}: PropsFromRedux): JSX.Element {
  const [userGrades, setUserGrades] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const {id} = useParams<FilmParam>();

  return (
    <div className="add-review">
      <form
        action="#"
        className="add-review__form"
        onSubmit={(evt: FormEvent<HTMLFormElement>) => {
          evt.preventDefault();
          setIsSending(true);
          if (userGrades !== null && userComment !== null) {
            onSubmit({
              filmId: Number(id),
              rating: Number(userGrades),
              comment: userComment,
            }, (error: string) => {
              setIsSending(false);
              setErrorMessage(error);
            });
          }
        }}
      >
        {errorMessage !== '' ? <p style={{color: 'red'}}>{errorMessage}</p> : ''}
        <fieldset style={{border: 'none', padding: 0}} disabled={isSending}>
          <div className="rating">
            <div className="rating__stars">
              {grades.map((grade) => (
                <>
                  <input
                    className="rating__input"
                    id={`star-${grade}`}
                    type="radio"
                    name="rating"
                    value={grade}
                    onChange={() => {
                      setUserGrades(grade);
                    }}
                  />
                  <label className="rating__label" htmlFor={`star-${grade}`}>Rating {grade}</label>
                </>),
              ).reverse()}
            </div>
          </div>

          <div className="add-review__text">
            <textarea
              className="add-review__textarea"
              name="review-text" id="review-text"
              placeholder="Review text"
              onChange={({target}: ChangeEvent<HTMLTextAreaElement>) => {
                setUserComment(target.value);
              }}
              value={userComment}
            />
            <div className="add-review__submit">
              <button
                className="add-review__btn"
                type="submit"
                disabled={!(userGrades > 0 && userComment.length >= 50 && userComment.length <= 400)}
              >
                Post
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export {ReviewForm};
export default connector(ReviewForm);
