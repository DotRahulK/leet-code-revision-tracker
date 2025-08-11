import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProblemsFacade } from './problems.facade';
import { ToastService } from './toast.service';

describe('ProblemsFacade', () => {
  let facade: ProblemsFacade;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProblemsFacade, { provide: ToastService, useValue: { error: () => {} } }]
    });
    facade = TestBed.inject(ProblemsFacade);
    http = TestBed.inject(HttpTestingController);
  });

  it('maps problems', () => {
    const obs = facade.list();
    obs.subscribe(res => {
      expect(res[0].slug).toBe('two-sum');
    });
    const req = http.expectOne('/problems');
    req.flush([{ id: '1', slug: 'two-sum', title: 'Two Sum', difficulty: 'Easy', tags: [] }]);
  });
});
